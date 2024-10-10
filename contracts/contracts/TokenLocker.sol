// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IProtocol.sol";

contract TokenLockerContract is ERC721Holder, Context, ReentrancyGuard {
	using EnumerableSet for EnumerableSet.AddressSet;
	using EnumerableSet for EnumerableSet.Bytes32Set;

	address public admin;
	IProtocol public Protocol; // Main Contract address for the IProtocol interface

	constructor(address _Protocol) {
		Protocol = IProtocol(_Protocol);
		admin = msg.sender;
	}

	event Deposit(
		bytes32 indexed lockId,
		address indexed user,
		address indexed protocol,
		address collection,
		uint[] tokens,
		uint lockPeriod
	);
	event Withdraw(bytes32 indexed lockId);
	event Liquidate(bytes32 lockId, address recipient);

	error Unauthorized(address caller);

	struct LockedTokens {
		address owner;
		address collection;
		uint[] tokens;
		uint lockTime;
	}

	mapping(bytes32 => LockedTokens) private lockedTokens;
	mapping(address => EnumerableSet.Bytes32Set) private lockIds;

	modifier isAdmin() {
		if (_msgSender() != admin) revert Unauthorized(_msgSender());
		_;
	}
	modifier idExists(bytes32 _id) {
		require(lockIds[_msgSender()].contains(_id));
		_;
	}
	modifier isProtocol() {
		bool isProtocolSupported = Protocol.isSupportedProtocol(_msgSender());
		if (!isProtocolSupported) {
			revert Unauthorized(_msgSender());
		}
		_;
	}
	modifier isSupportedCollection(address _collection) {
		require(
			Protocol.getCollectionData(_collection).collectionAddress !=
				address(0)
		);
		_;
	}

	function _withdraw(
		address _collection,
		uint[] storage _tokens,
		address _recipient
	) private {
		IERC721 nft = IERC721(_collection);
		uint length = _tokens.length;
		for (uint i; i < length; ) {
			uint tokenId = _tokens[i];
			nft.safeTransferFrom(address(this), _recipient, tokenId);
			unchecked {
				i++;
			}
		}
	}

	function _deposit(
		address _collection,
		uint[] calldata _tokens,
		address _ownerOf
	) private {
		IERC721 nft = IERC721(_collection);
		uint length = _tokens.length;
		for (uint i; i < length; ) {
			uint tokenId = _tokens[i];
			nft.safeTransferFrom(_ownerOf, address(this), tokenId);
			unchecked {
				i++;
			}
		}
	}

	function deposit(
		address _collection,
		uint[] calldata _tokens,
		uint _unlock,
		address _ownerOf
	)
		external
		nonReentrant
		isSupportedCollection(_collection)
		returns (bytes32 lockId)
	{
		require(_tokens.length > 0);
		lockId = keccak256(
			abi.encode(_ownerOf, _collection, _tokens, _unlock, block.number)
		);
		lockIds[_msgSender()].add(lockId);
		LockedTokens storage lockTokens = lockedTokens[lockId];
		uint __lockTime = 0;
		address __protocol = address(0);
		bool isProtocolSupported = Protocol.isSupportedProtocol(_msgSender());
		if (isProtocolSupported) {
			__protocol = _msgSender();
		} else {
			require(_unlock >= 7);
			require(_ownerOf == _msgSender());
			__lockTime = block.timestamp + _unlock * 1 days;
		}
		_deposit(_collection, _tokens, _ownerOf);
		lockTokens.collection = _collection;
		lockTokens.owner = _ownerOf;
		lockTokens.tokens = _tokens;
		lockTokens.lockTime = __lockTime;
		emit Deposit(
			lockId,
			_ownerOf,
			__protocol,
			_collection,
			_tokens,
			__lockTime
		);
	}

	function withdraw(bytes32 _lockId) external nonReentrant idExists(_lockId) {
		LockedTokens storage lockTokens = lockedTokens[_lockId];
		address _ownerOf = lockTokens.owner;
		bool isProtocolSupported = Protocol.isSupportedProtocol(_msgSender());
		if (!isProtocolSupported) {
			if (_ownerOf != _msgSender()) {
				revert Unauthorized(_msgSender());
			}
			require(block.timestamp > lockTokens.lockTime);
		}
		_withdraw(lockTokens.collection, lockTokens.tokens, _ownerOf);
		lockIds[_msgSender()].remove(_lockId);
		delete lockedTokens[_lockId];
		emit Withdraw(_lockId);
	}

	function liquidate(
		bytes32 _lockId,
		address _recipient
	) external nonReentrant isProtocol {
		LockedTokens storage lockTokens = lockedTokens[_lockId];
		_withdraw(lockTokens.collection, lockTokens.tokens, _recipient);
		lockIds[_msgSender()].remove(_lockId);
		delete lockedTokens[_lockId];
		emit Liquidate(_lockId, _recipient);
	}

	function updateProtocol(address _Protocol) external isAdmin {
		Protocol = IProtocol(_Protocol);
	}
	function updateAdmin(address _newAdmin) external isAdmin {
		admin = _newAdmin;
	}

	function getLockedIds(
		address locker
	) external view returns (bytes32[] memory _lockIds) {
		uint length = lockIds[locker].length();
		_lockIds = new bytes32[](length);
		for (uint i; i < length; ) {
			_lockIds[i] = lockIds[locker].at(i);
			unchecked {
				i++;
			}
		}
	}
	function getLockedTokensData(
		bytes32 _id
	) external view returns (LockedTokens memory lockTokens) {
		lockTokens = lockedTokens[_id];
	}
}
