export const TOKENLOCKER_ABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_Protocol",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "caller",
				type: "address",
			},
		],
		name: "Unauthorized",
		type: "error",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "lockId",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "protocol",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "collection",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "tokens",
				type: "uint256[]",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "lockPeriod",
				type: "uint256",
			},
		],
		name: "Deposit",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bytes32",
				name: "lockId",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "address",
				name: "recipient",
				type: "address",
			},
		],
		name: "Liquidate",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "lockId",
				type: "bytes32",
			},
		],
		name: "Withdraw",
		type: "event",
	},
	{
		inputs: [],
		name: "Protocol",
		outputs: [
			{
				internalType: "contract IProtocol",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "admin",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_collection",
				type: "address",
			},
			{
				internalType: "uint256[]",
				name: "_tokens",
				type: "uint256[]",
			},
			{
				internalType: "uint256",
				name: "_unlock",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "_ownerOf",
				type: "address",
			},
		],
		name: "deposit",
		outputs: [
			{
				internalType: "bytes32",
				name: "lockId",
				type: "bytes32",
			},
		],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "locker",
				type: "address",
			},
		],
		name: "getLockedIds",
		outputs: [
			{
				internalType: "bytes32[]",
				name: "_lockIds",
				type: "bytes32[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "_id",
				type: "bytes32",
			},
		],
		name: "getLockedTokensData",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						internalType: "address",
						name: "collection",
						type: "address",
					},
					{
						internalType: "uint256[]",
						name: "tokens",
						type: "uint256[]",
					},
					{
						internalType: "uint256",
						name: "lockTime",
						type: "uint256",
					},
				],
				internalType: "struct TokenLockerContract.LockedTokens",
				name: "lockTokens",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "_lockId",
				type: "bytes32",
			},
			{
				internalType: "address",
				name: "_recipient",
				type: "address",
			},
		],
		name: "liquidate",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
			{
				internalType: "address",
				name: "",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "",
				type: "bytes",
			},
		],
		name: "onERC721Received",
		outputs: [
			{
				internalType: "bytes4",
				name: "",
				type: "bytes4",
			},
		],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_newAdmin",
				type: "address",
			},
		],
		name: "updateAdmin",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_Protocol",
				type: "address",
			},
		],
		name: "updateProtocol",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "_lockId",
				type: "bytes32",
			},
		],
		name: "withdraw",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;
