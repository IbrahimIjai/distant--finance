// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface IWETH {
	function deposit() external payable;
}

contract DistantFinance is Context, Ownable, Pausable, ReentrancyGuard {
	// Libraries
	using EnumerableSet for EnumerableSet.AddressSet;
	using Address for address;
	using SafeERC20 for IERC20;

	// Variables
	address private immutable WETH; // Native ERC20 token for protocols
	uint16 public protocolFee; // Protocol fee
	address public admin; // Protocol controller
	uint16 private constant minFees = 0; // 1% == 100 etc.
	uint16 private constant maxFees = 1000; // 1000 == 10%
	address private proxyAdmin; // Protocol data management
	address private revenueCollector; // Protocol revenue collector

	// Enums
	enum Status {
		Unverified,
		Verified
	}

	// Events
	event CollectionAdded(
		address indexed collection,
		address collectionFeeCollector,
		uint256 royaltyFees
	);
	event CollectionUpdated(
		address indexed collection,
		address collectionFeeCollector,
		uint256 royaltyFees
	);
	event CollectionVerificationStatus(
		address indexed collection,
		Status status,
		string ipfs
	);
	event CollectionRemoved(address indexed collection);
	event protocolFeeUpdated(uint256 fees);
	event RevenueWithdrawn(address indexed account, uint256 amount);
	event ProtocolRemoved(address indexed protocol);
	event ProtocolCreated(
		address indexed protocol,
		string name,
		uint16 protocolFee,
		uint16 securityFee
	);

	// Constructor
	/**
	 * @notice Constructor for the Protocol
	 * @param _protocolFee fee to be in counts of 100: 1% == 100, 10% = 1000
	 * @param _admin address of the proxy admin
	 * @param _WETH address of the _WETH token
	 * @param _revenueCollector address of the revenue collector
	 */
	constructor(
		uint16 _protocolFee, // fee to be in counts of 100: 1% = 100, 10% = 1000
		address _admin,
		address _WETH,
		address _revenueCollector
	) {
		protocolFee = _protocolFee;
		admin = _msgSender();
		proxyAdmin = _admin;
		WETH = _WETH;
		revenueCollector = _revenueCollector;
		Ownable(_msgSender());
	}

	// Structs
	// A struct that tracks the royalty fees collection address, its royalty fees and state of its verification. Paramount for future updates when making the Protocol decentralized
	struct Collection {
		address collectionAddress;
		uint256 royaltyFees;
		Status status;
	}
	// An address set of all supported collections
	EnumerableSet.AddressSet private collections;

	// data mappings
	// tracks the revenue generation for the protocol and the collection royalty fees
	mapping(address => uint256) private revenue;
	// Maps a collection address to its information
	mapping(address => Collection) private collection;
	// All supported in-house contracts
	mapping(address => bool) private isProtocol;

	/// All read functions
	function getAccountRevenue(
		address _account
	) external view returns (uint256) {
		return revenue[_account];
	}

	/**
	 * @notice Get all collections supported by the Protocol
	 */
	function getSupportedCollections()
		external
		view
		returns (address[] memory _supportedCollections)
	{
		uint256 length = collections.length();
		_supportedCollections = new address[](length);
		for (uint256 i; i < length; i++) {
			_supportedCollections[i] = collections.at(i);
		}
	}

	/**
	 * @notice a public getter function to get a collection information from the collection mapping
	 * @param _collection address to check offer from
	 */
	function getCollectionData(
		address _collection
	) public view returns (Collection memory) {
		return collection[_collection];
	}

	// Modifiers
	// modifier to check that only admin can call the function
	modifier isAdmin() {
		require(_msgSender() == admin, "Caller != Admin");
		_;
	}
	// modifier to check that only proxy admin can call the function
	modifier isProxyAdmin() {
		require(_msgSender() == proxyAdmin, "Caller != Proxy Admin");
		_;
	}
	// modifier to check if a collection is supported
	modifier isCollection(address _collection) {
		require(collections.contains(_collection), "Collection not supported");
		_;
	}
	// modifier to limit certain external functions from being called by external users
	modifier isProtocolCall() {
		require(isSupportedProtocol(_msgSender()));
		_;
	}

	function isSupportedProtocol(address _address) public view returns (bool) {
		return isProtocol[_address];
	}

	function updateRevenue(
		uint256 ProtocolFee,
		uint256 collectionFee,
		address _collection
	) external isProtocolCall {
		_updateRevenue(ProtocolFee, collectionFee, _collection);
	}

	function _updateRevenue(
		uint256 ProtocolFee,
		uint256 collectionFee,
		address _collection
	) private {
		if (collectionFee != 0) {
			address collectionFeeCollector = collection[_collection]
				.collectionAddress;
			revenue[collectionFeeCollector] += collectionFee;
		}
		if (ProtocolFee != 0) {
			revenue[revenueCollector] += ProtocolFee;
		}
	}


// fee to be in counts of 100: 1% = 100, 10% = 1000
	function calculateFee(
		address _collection,
		uint256 _value,
		uint256 _protocolFee
	)
		public
		view
		returns (uint256 amount, uint256 ProtocolFee, uint256 collectionFee)
	{
		ProtocolFee = (_value * _protocolFee) / 10000;
		collectionFee = (_value * collection[_collection].royaltyFees) / 10000;
		amount = _value - (ProtocolFee + collectionFee);
	}

	/** 
        @notice Add a collection to the Protocol
        @param _collection address of the collection
        @param _collectionAddress address of the royalty fees receiver
        @param _royaltyFees uint256 of the royalty fees
    */
	function addCollection(
		address _collection,
		address _collectionAddress,
		uint256 _royaltyFees
	) external whenNotPaused isAdmin {
		require(!collections.contains(_collection), "Collection exists");
		require(
			IERC721(_collection).supportsInterface(0x80ac58cd),
			"not supported"
		);
		require(
			_royaltyFees >= minFees && _royaltyFees <= (maxFees - protocolFee),
			"fees error"
		);
		collections.add(_collection);
		collection[_collection] = Collection(
			_collectionAddress,
			_royaltyFees,
			Status.Unverified
		);
		emit CollectionAdded(_collection, _collectionAddress, _royaltyFees);
	}

	/** 
        @notice Update a collection to the Protocol
        @param _collection address of the collection
        @param _collectionAddress address of the royalty fees receiver
        @param _royaltyFees uint256 of the royalty fees
    */
	function updateCollection(
		address _collection,
		address _collectionAddress,
		uint256 _royaltyFees
	) external whenNotPaused isCollection(_collection) isAdmin {
		require(
			_royaltyFees >= minFees && _royaltyFees <= (maxFees - protocolFee),
			"high fees"
		);
		require(
			_msgSender() == collection[_collection].collectionAddress,
			"Only Collection admin can update"
		);
		collection[_collection] = Collection(
			_collectionAddress,
			_royaltyFees,
			Status.Unverified
		);
		emit CollectionUpdated(_collection, _collectionAddress, _royaltyFees);
	}

	/** 
        @notice Remove a collection from the Protocol
        @param _collection address of the collection
    */
	function removeCollection(
		address _collection
	) external whenNotPaused isAdmin isCollection(_collection) {
		collections.remove(_collection);
		delete (collection[_collection]);
		emit CollectionRemoved(_collection);
	}

	/** 
        @notice Verify a collection from the Protocol
        @param _collection address of the collection
    */
	function verifyCollectionStatus(
		address _collection,
		string calldata _ipfsHash
	) external isAdmin isCollection(_collection) {
		Collection storage collectionStatus = collection[_collection];
		collectionStatus.status = Status.Verified;
		emit CollectionVerificationStatus(
			_collection,
			collectionStatus.status,
			_ipfsHash
		);
	}

	/**
	 * @notice Withdraw revenue generated from the Protocol
	 */
	function withdrawRevenue() external whenNotPaused nonReentrant {
		uint256 revenueGenerated = revenue[_msgSender()];
		require(revenueGenerated != 0, "revenue = 0");
		revenue[_msgSender()] = 0;
		IERC20(WETH).safeTransfer(_msgSender(), revenueGenerated);
		emit RevenueWithdrawn(_msgSender(), revenueGenerated);
	}

	//OnlyOwner function calls
	/** 
        @notice update the protocol fee
        @param _newprotocolFee uint16 of the new protocol fee
    */
	function updateprotocolFee(
		uint16 _newprotocolFee
	) external whenPaused onlyOwner {
		protocolFee = _newprotocolFee;
		emit protocolFeeUpdated(_newprotocolFee);
	}

	/** 
        @notice update the admin address
        @param _newAdmin address of the new admin
    */
	function updateAdmin(address _newAdmin) external whenPaused onlyOwner {
		admin = _newAdmin;
	}

	/** 
        @notice update the proxy admin address
        @param _newAdmin address of the new admin
    */
	function updateProxyAdmin(address _newAdmin) external whenPaused onlyOwner {
		proxyAdmin = _newAdmin;
	}

	/** 
        @notice update the revenue collector address
        @param _newRevenueCollector address of the new revenue collector
    */
	function updateRevenueCollector(
		address _newRevenueCollector
	) external whenPaused onlyOwner {
		revenueCollector = _newRevenueCollector;
	}

	function addProtocol(
		address _protocol,
		string calldata _name,
		uint16 _protocolFee,
		uint16 _securityFee
	) external onlyOwner {
		isProtocol[_protocol] = true;
		emit ProtocolCreated(_protocol, _name, _protocolFee, _securityFee);
	}

	function removeProtocol(address _protocol) external onlyOwner {
		isProtocol[_protocol] = false;
		emit ProtocolRemoved(_protocol);
	}

	/** 
        @notice recover any ERC20 token sent to the contract
        @param _token address of the token to recover
    */
	function recoverToken(address _token) external whenPaused onlyOwner {
		require(_token != WETH, "Cannot recover");
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

	function pause() external whenNotPaused onlyOwner {
		_pause();
	}

	function unpause() external whenPaused onlyOwner {
		_unpause();
	}
}
