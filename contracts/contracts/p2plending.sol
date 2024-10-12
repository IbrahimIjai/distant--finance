// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/ITokenLocker.sol";
import "./interfaces/IProtocol.sol";
import "./interfaces/IWETH.sol";

contract P2PLending is Context, ReentrancyGuard, Pausable {
	//Libraries
	using EnumerableSet for EnumerableSet.AddressSet;
	using EnumerableSet for EnumerableSet.Bytes32Set;
	using Address for address;
	using SafeERC20 for IERC20;

	//State Variables
	ITokenLocker private TokenLocker; //Token locker contract used to hold collateral
	IERC20 private immutable WETH;
	IProtocol private Protocol;
	// Interest rates are multiplied by 100 to give padding to interest rates below 1: 0.1, 0.001
	uint16 private securityFee = 200; // 2% == 200;
	uint16 private protocolFee = 1000; // 10% == 1000;
	uint8 private minExpiryDay = 7;
	uint8 private maxExpiryDay = 90;
	uint private minBorrowAmount = 100000000 gwei; // 0.1 ETH
	uint16 private constant aprDivider = 10000; // 100% == 10000;
	uint16 private minInterest = 100; // 1% == 100;

	address private admin;

	constructor(address _TokenLocker, address _WETH, address _Protocol) {
		TokenLocker = ITokenLocker(_TokenLocker);
		Protocol = IProtocol(_Protocol);
		WETH = IERC20(_WETH);
		admin = _msgSender();
	}

	//Events
	event ContractOpened(
		bytes32 indexed id,
		address indexed borrower,
		bytes32 indexed lockId,
		uint amount,
		uint16 interest,
		uint expiry
	);
	event ContractClosed(bytes32 indexed id);
	event ContractActive(
		bytes32 indexed id,
		address indexed lender,
		uint16 interest,
		uint expiry,
		uint checkPointBlock
	);
	event BidOpened(
		bytes32 indexed id,
		address indexed bidder,
		uint16 proposedInterest
	);
	event BidClosed(bytes32 indexed id, address indexed bidder);
	event LostBid(bytes32 indexed id, address indexed bidder, uint amount);
	event LoanRepaid(bytes32 indexed id, uint repaidInterest);
	event Liquidate(bytes32 indexed id);
	event UpdateProtocolFees(uint16 securityFee, uint16 protocolFee);
	event UpdateProtocolBorrowParameters(
		uint16 minInterest,
		uint minBorrowAmount
	);
	event UpdateProtocolDateParameters(uint8 minExpiryDay, uint8 maxExpiryDay);

	error Unauthorized(address creator);
	error ActiveLoan(bytes32 id);
	error InactiveLoan(bytes32 id);
	error LoanContractActive(bytes32 id);
	error LoanContractInactive(bytes32 id);
	error InvalidPeriod(uint8 invalidPeriod);
	error InvalidInterest(uint16 invalidInterest);
	//Struct and Mapping
	struct LoanContract {
		address borrower;
		address lender;
		address collection;
		uint16 interest;
		uint amount;
		uint expiry;
		uint checkPointBlock;
		mapping(address => uint16) bids;
		EnumerableSet.AddressSet bidders;
		bytes32 lockId;
	}
	struct UserBids {
		mapping(bytes32 => uint16) proposedInterest;
		uint withdrawableBids;
	}
	mapping(bytes32 => LoanContract) private borrowContract;
	mapping(address => UserBids) private bids;
	mapping(address => EnumerableSet.Bytes32Set) private userLoanIds;

	//Modifiers
	modifier canOpenContract(
		uint _amount,
		uint8 _expiry,
		uint16 _interest
	) {
		require(_amount >= minBorrowAmount);
		if (_expiry < minExpiryDay && _expiry > maxExpiryDay) {
			revert InvalidPeriod(_expiry);
		}
		if (_interest < minInterest && _interest > aprDivider) {
			revert InvalidInterest(_interest);
		}
		_;
	}

	modifier canOpenBid(uint16 _interest, bytes32 _id) {
		LoanContract storage _loanContract = borrowContract[_id];
		if (_loanContract.borrower == address(0)) {
			revert LoanContractInactive(_id);
		}
		if (_loanContract.borrower == _msgSender()) {
			revert Unauthorized(_msgSender());
		}
		if (_loanContract.lender != address(0)) {
			revert ActiveLoan(_id);
		}
		if (_interest < minInterest && _interest > aprDivider) {
			revert InvalidInterest(_interest);
		}
		_;
	}
	modifier canLend(bytes32 _id) {
		LoanContract storage _loanContract = borrowContract[_id];
		if (_loanContract.borrower == address(0)) {
			revert LoanContractInactive(_id);
		}
		if (_loanContract.lender != address(0)) {
			revert ActiveLoan(_id);
		}
		if (_loanContract.borrower == _msgSender()) {
			revert Unauthorized(_msgSender());
		}
		_;
	}
	modifier canBeClosed(bytes32 _id) {
		LoanContract storage _loanContract = borrowContract[_id];
		if (_loanContract.borrower != _msgSender()) {
			revert Unauthorized(_msgSender());
		}
		if (_loanContract.lender != address(0)) {
			revert ActiveLoan(_id);
		}
		_;
	}
	modifier canBeRepaid(bytes32 _id) {
		LoanContract storage _loanContract = borrowContract[_id];
		if (_loanContract.borrower == address(0)) {
			revert LoanContractInactive(_id);
		}
		if (_loanContract.borrower != _msgSender()) {
			revert Unauthorized(_msgSender());
		}
		if (_loanContract.lender == address(0)) {
			revert InactiveLoan(_id);
		}
		_;
	}
	modifier canBeLiquidated(bytes32 _id) {
		LoanContract storage _loanContract = borrowContract[_id];
		if (_loanContract.lender != _msgSender()) {
			revert Unauthorized(_msgSender());
		}
		if (block.timestamp < _loanContract.expiry) {
			revert ActiveLoan(_id);
		}
		_;
	}
	modifier isAdmin() {
		if (_msgSender() != admin) {
			revert Unauthorized(_msgSender());
		}
		_;
	}

	//Helper functions
	function _clearBids(
		LoanContract storage _loanContract,
		bytes32 _mappingId
	) private {
		uint length = _loanContract.bidders.length();
		uint _amount = _loanContract.amount;
		for (uint i; i < length; ) {
			address _bidder = _loanContract.bidders.at(0);
			_loanContract.bidders.remove(_bidder);
			UserBids storage _userBids = bids[_bidder];
			_userBids.proposedInterest[_mappingId] = 0;
			_userBids.withdrawableBids += _amount;
			emit LostBid(_mappingId, _bidder, _amount);
			unchecked {
				i++;
			}
		}
	}

	function _getInterest(
		LoanContract storage _account
	) private view returns (uint) {
		uint interestToPay = 0;
		if (_account.lender == address(0)) {
			return interestToPay;
		}
		uint totalInterest = (_account.interest * _account.amount) / aprDivider;
		uint interestPerBlock = totalInterest / 10512000;
		uint totalBlocks = block.number - _account.checkPointBlock;
		interestToPay = interestPerBlock * totalBlocks;
		return interestToPay;
	}

	//User functions
	function openContract(
		address _collection,
		uint[] calldata _tokens,
		uint _amountToBorrow,
		uint8 _expiryInDays,
		uint16 _interestToPay
	)
		external
		whenNotPaused
		nonReentrant
		canOpenContract(_amountToBorrow, _expiryInDays, _interestToPay)
	{
		bytes32 _lockId = TokenLocker.deposit(
			_collection,
			_tokens,
			0,
			_msgSender()
		);
		bytes32 mappingId = keccak256(
			abi.encode(
				_msgSender(),
				_collection,
				_amountToBorrow,
				_expiryInDays,
				_interestToPay,
				block.timestamp
			)
		);
		LoanContract storage _loanContract = borrowContract[mappingId];
		uint expiry = uint256(_expiryInDays);
		_loanContract.borrower = _msgSender();
		_loanContract.interest = _interestToPay;
		_loanContract.amount = _amountToBorrow;
		_loanContract.expiry = expiry;
		_loanContract.lockId = _lockId;
		_loanContract.collection = _collection;
		userLoanIds[_msgSender()].add(mappingId);
		emit ContractOpened(
			mappingId,
			_msgSender(),
			_lockId,
			_amountToBorrow,
			_interestToPay,
			expiry
		);
	}

	function bidInETH(
		uint16 _proposedInterest,
		bytes32 _id
	) external payable whenNotPaused nonReentrant {
		LoanContract storage _loanContract = borrowContract[_id];
		uint16 prevApr = _loanContract.bids[_msgSender()];
		uint _amount = _loanContract.amount;
		if (prevApr == 0) {
			require(msg.value >= _amount);
			address weth = address(WETH);
			IWETH(weth).deposit{ value: _amount }();
		}
		_openBid(_proposedInterest, _id, _loanContract);
	}

	function bidInWETH(
		uint16 _proposedInterest,
		bytes32 _id
	) external whenNotPaused nonReentrant {
		LoanContract storage _loanContract = borrowContract[_id];
		uint16 prevApr = _loanContract.bids[_msgSender()];
		if (prevApr == 0) {
			WETH.safeTransferFrom(
				_msgSender(),
				address(this),
				_loanContract.amount
			);
		}
		_openBid(_proposedInterest, _id, _loanContract);
	}

	function _openBid(
		uint16 _proposedInterest,
		bytes32 _id,
		LoanContract storage _loanContract
	) private canOpenBid(_proposedInterest, _id) {
		_loanContract.bids[_msgSender()] = _proposedInterest;
		_loanContract.bidders.add(_msgSender());
		bids[_msgSender()].proposedInterest[_id] = _proposedInterest;
		emit BidOpened(_id, _msgSender(), _proposedInterest);
	}

	function cancelBid(bytes32 _id) external nonReentrant {
		LoanContract storage _loanContract = borrowContract[_id];
		require(_loanContract.bidders.contains(_msgSender()));
		_loanContract.bidders.remove(_msgSender());
		_loanContract.bids[_msgSender()] = 0;
		bids[_msgSender()].proposedInterest[_id] = 0;
		WETH.safeTransfer(_msgSender(), _loanContract.amount);
		emit BidClosed(_id, _msgSender());
	}

	function acceptBid(address _bidder, bytes32 _id) external nonReentrant {
		LoanContract storage _loanContract = borrowContract[_id];
		require(_loanContract.bidders.contains(_bidder));
		_loanContract.interest = _loanContract.bids[_bidder];
		_loanContract.bidders.remove(_bidder);
		_clearBids(_loanContract, _id);
		_lend(_id, _loanContract, _bidder);
	}

	function lendInWETH(
		bytes32 _id
	) external whenNotPaused nonReentrant canLend(_id) {
		LoanContract storage _loanContract = borrowContract[_id];
		WETH.safeTransferFrom(
			_msgSender(),
			address(this),
			_loanContract.amount
		);
		_clearBids(_loanContract, _id);
		_lend(_id, _loanContract, _msgSender());
	}

	function lendInETH(
		bytes32 _id
	) external payable whenNotPaused nonReentrant canLend(_id) {
		LoanContract storage _loanContract = borrowContract[_id];
		uint _amount = _loanContract.amount;
		require(msg.value >= _amount);
		address weth = address(WETH);
		IWETH(weth).deposit{ value: _amount }();
		_clearBids(_loanContract, _id);
		_lend(_id, _loanContract, _msgSender());
	}

	function _lend(
		bytes32 _id,
		LoanContract storage _loanContract,
		address _lender
	) private {
		uint amount = _loanContract.amount;
		uint expiry = block.timestamp + _loanContract.expiry * 1 days;
		uint _securityFee = (amount * securityFee) / aprDivider;
		uint borrowableAmount = amount - _securityFee;
		_loanContract.expiry = expiry;
		_loanContract.checkPointBlock = block.number;
		_loanContract.lender = _lender;
		WETH.safeTransfer(_loanContract.borrower, borrowableAmount);
		emit ContractActive(
			_id,
			_lender,
			_loanContract.interest,
			expiry,
			block.number
		);
	}

	function closeContract(bytes32 _id) external nonReentrant canBeClosed(_id) {
		LoanContract storage _loanContract = borrowContract[_id];
		_clearBids(_loanContract, _id);
		_closeContract(_id, _loanContract);
		emit ContractClosed(_id);
	}

	function _closeContract(
		bytes32 _id,
		LoanContract storage _loanContract
	) private {
		bytes32 _lockId = _loanContract.lockId;
		delete borrowContract[_id];
		userLoanIds[_msgSender()].remove(_id);
		TokenLocker.withdraw(_lockId);
	}

	function repayLoan(bytes32 _id) external nonReentrant canBeRepaid(_id) {
		LoanContract storage _loanContract = borrowContract[_id];
		uint interest = _getInterest(_loanContract);
		uint amountBorrowed = _loanContract.amount;
		uint total = interest + amountBorrowed;
		WETH.safeTransferFrom(_msgSender(), address(this), total);
		uint _securityFee = (amountBorrowed * securityFee) / aprDivider;
		uint repayableInterest = _updateRevenue(
			_loanContract.collection,
			interest,
			protocolFee
		);
		uint repayableAmount = total - repayableInterest;
		WETH.safeTransfer(_loanContract.lender, repayableAmount);
		WETH.safeTransfer(_msgSender(), _securityFee);
		_closeContract(_id, _loanContract);
		emit LoanRepaid(_id, interest);
	}

	function _updateRevenue(
		address _collection,
		uint _amount,
		uint _lendingFee
	) private returns (uint) {
		(uint256 amount, uint256 ProtocolFee, uint256 collectionFee) = Protocol
			.calculateFee(_collection, _amount, _lendingFee);
		uint256 totalFees = ProtocolFee + collectionFee;
		WETH.safeTransfer(address(Protocol), totalFees);
		Protocol.updateRevenue(ProtocolFee, collectionFee, _collection);
		return amount;
	}

	function liquidate(bytes32 _id) external nonReentrant canBeLiquidated(_id) {
		LoanContract storage _loanContract = borrowContract[_id];
		uint _securityFee = (_loanContract.amount * securityFee) / aprDivider;
		uint liquidationRefund = _updateRevenue(
			_loanContract.collection,
			_securityFee,
			protocolFee
		);
		bytes32 _lockId = _loanContract.lockId;
		userLoanIds[_loanContract.borrower].remove(_id);
		delete borrowContract[_id];
		TokenLocker.liquidate(_lockId, _msgSender());
		WETH.safeTransfer(_msgSender(), liquidationRefund);
		emit Liquidate(_id);
	}

	function withdrawLostBids() external nonReentrant {
		UserBids storage _userBids = bids[_msgSender()];
		uint lostBidsValue = _userBids.withdrawableBids;
		require(lostBidsValue > 0);
		_userBids.withdrawableBids = 0;
		WETH.safeTransfer(_msgSender(), lostBidsValue);
	}

	//Read functions
	function getInterest(bytes32 _id) external view returns (uint) {
		LoanContract storage _loanContract = borrowContract[_id];
		return _getInterest(_loanContract);
	}

	function getLoanData(
		bytes32 _id
	) external view returns (address, address, uint, uint, uint, bytes32) {
		LoanContract storage _loanContract = borrowContract[_id];
		address _borrower = _loanContract.borrower;
		address _lender = _loanContract.lender;
		uint _interest = _loanContract.interest;
		uint _amount = _loanContract.amount;
		uint _expiry = _loanContract.expiry;
		bytes32 _lockId = _loanContract.lockId;
		return (_borrower, _lender, _interest, _amount, _expiry, _lockId);
	}

	function getLostBidsValue(address _bidder) external view returns (uint) {
		uint lostBidsValue = bids[_bidder].withdrawableBids;
		return lostBidsValue;
	}

	function getUserActiveLoanIds(
		address _borrower
	) external view returns (bytes32[] memory ids) {
		uint length = userLoanIds[_borrower].length();
		ids = new bytes32[](length);
		for (uint i; i < length; ) {
			ids[i] = userLoanIds[_borrower].at(i);
			unchecked {
				i++;
			}
		}
	}

	function getUserLoanIds(
		address _borrower
	) external view returns (bytes32[] memory) {
		return userLoanIds[_borrower].values();
	}

	
	function getAdmin() external view returns (address) {
		return admin;
	}

	//Admin functions
	function updateFee(
		uint16 _securityFee,
		uint16 _protocolFee
	) external isAdmin {
		require(
			_securityFee >= 1 && _securityFee <= 10,
			"security fee params are out of bound"
		);
		require(
			_protocolFee >= 1 && _protocolFee <= 30,
			"protocol fee params are out of bound"
		);
		securityFee = _securityFee;
		protocolFee = _protocolFee;
		emit UpdateProtocolFees(_securityFee, _protocolFee);
	}

	function updateInterestAndMinBorrowAmount(
		uint16 _minInterest,
		uint _minBorrowAmount
	) external isAdmin {
		require(
			_minInterest >= 1 && _minInterest <= aprDivider,
			"minimum interest params are out of bounds"
		);
		require(_minBorrowAmount >= 1 gwei, "minimum borrow is not in bounds");
		minInterest = _minInterest;
		minBorrowAmount = _minBorrowAmount;
		emit UpdateProtocolBorrowParameters(_minInterest, _minBorrowAmount);
	}

	function updateExpiryDays(uint8 _min, uint8 _max) external isAdmin {
		require(_min >= 7 && _max < 255, "params are out of bounds");
		minExpiryDay = _min;
		maxExpiryDay = _max;
		emit UpdateProtocolDateParameters(_min, _max);
	}

	function updateAdmin(address _admin) external isAdmin {
		require(_admin != address(0), "Address 0 not allowed");
		admin = _admin;
	}

	function updateTokenLocker(address _TokenLocker) external isAdmin {
		require(_TokenLocker != address(0), "Address 0 not allowed");
		TokenLocker = ITokenLocker(_TokenLocker);
	}

	function updateProtocol(address _Protocol) external isAdmin {
		require(_Protocol != address(0), "Address 0 not allowed");
		Protocol = IProtocol(_Protocol);
	}

	function recoverToken(address _token) external whenPaused isAdmin {
		require(_token != address(WETH), "WETH cannot be recovered");
		if (_token == address(0)) {
			uint etherBalance = address(this).balance;
			require(etherBalance > 0, "Ether balance is 0");
			(bool sent, ) = admin.call{ value: etherBalance }("");
			require(sent, "Failed to send Ether");
		} else {
			IERC20 token = IERC20(_token);
			uint balanceOf = token.balanceOf(address(this));
			token.safeTransfer(_msgSender(), balanceOf);
		}
	}

	function pause() external whenNotPaused isAdmin {
		_pause();
	}

	function unpause() external whenPaused isAdmin {
		_unpause();
	}
}

// When a user bid is accepted, in the subgraph, account for it by checking if a userBid schema is active for that specific address
