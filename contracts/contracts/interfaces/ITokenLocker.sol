// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITokenLocker {
    function deposit(
        address _collection,
        uint[] calldata _tokens,
        uint _unlock,
        address _user
    ) external returns (bytes32);

    function withdraw(bytes32 _lockId) external;

    function liquidate(bytes32 _lockId, address _recipient) external;
}

