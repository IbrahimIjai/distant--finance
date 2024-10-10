// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Collection {
	address collectionAddress;
}

interface IProtocol {
	function updateRevenue(
		uint256 marketplaceFee,
		uint256 collectionFee,
		address _collection
	) external;

	function calculateFee(
		address _collection,
		uint256 _price,
		uint256 _protocolFee
	)
		external
		view
		returns (uint256 amount, uint256 marketplaceFee, uint256 collectionFee);

	function isSupportedProtocol(address _address) external view returns (bool);

	function getCollectionData(
		address _collection
	) external view returns (Collection memory);
}
