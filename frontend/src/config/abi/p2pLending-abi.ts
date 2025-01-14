export const P2PLENDING_ABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_TokenLocker",
				type: "address",
			},
			{
				internalType: "address",
				name: "_WETH",
				type: "address",
			},
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
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
		],
		name: "ActiveLoan",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
		],
		name: "InactiveLoan",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "uint16",
				name: "invalidInterest",
				type: "uint16",
			},
		],
		name: "InvalidInterest",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "invalidPeriod",
				type: "uint8",
			},
		],
		name: "InvalidPeriod",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
		],
		name: "LoanContractActive",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
		],
		name: "LoanContractInactive",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "creator",
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
				name: "id",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "bidder",
				type: "address",
			},
		],
		name: "BidClosed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "bidder",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "proposedInterest",
				type: "uint16",
			},
		],
		name: "BidOpened",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "lender",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "interest",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "expiry",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "checkPointBlock",
				type: "uint256",
			},
		],
		name: "ContractActive",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
		],
		name: "ContractClosed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "borrower",
				type: "address",
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "lockId",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "interest",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "expiry",
				type: "uint256",
			},
		],
		name: "ContractOpened",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
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
				name: "id",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "repaidInterest",
				type: "uint256",
			},
		],
		name: "LoanRepaid",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "id",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "bidder",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "LostBid",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "Paused",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "Unpaused",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint16",
				name: "minInterest",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "minBorrowAmount",
				type: "uint256",
			},
		],
		name: "UpdateProtocolBorrowParameters",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint8",
				name: "minExpiryDay",
				type: "uint8",
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "maxExpiryDay",
				type: "uint8",
			},
		],
		name: "UpdateProtocolDateParameters",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint16",
				name: "securityFee",
				type: "uint16",
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "protocolFee",
				type: "uint16",
			},
		],
		name: "UpdateProtocolFees",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_bidder",
				type: "address",
			},
			{
				internalType: "bytes32",
				name: "_id",
				type: "bytes32",
			},
		],
		name: "acceptBid",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint16",
				name: "_proposedInterest",
				type: "uint16",
			},
			{
				internalType: "bytes32",
				name: "_id",
				type: "bytes32",
			},
		],
		name: "bidInETH",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint16",
				name: "_proposedInterest",
				type: "uint16",
			},
			{
				internalType: "bytes32",
				name: "_id",
				type: "bytes32",
			},
		],
		name: "bidInWETH",
		outputs: [],
		stateMutability: "nonpayable",
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
		name: "cancelBid",
		outputs: [],
		stateMutability: "nonpayable",
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
		name: "closeContract",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "getAdmin",
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
				internalType: "bytes32",
				name: "_id",
				type: "bytes32",
			},
		],
		name: "getInterest",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
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
		name: "getLoanData",
		outputs: [
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
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_bidder",
				type: "address",
			},
		],
		name: "getLostBidsValue",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_borrower",
				type: "address",
			},
		],
		name: "getUserActiveLoanIds",
		outputs: [
			{
				internalType: "bytes32[]",
				name: "ids",
				type: "bytes32[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_borrower",
				type: "address",
			},
		],
		name: "getUserLoanIds",
		outputs: [
			{
				internalType: "bytes32[]",
				name: "",
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
		name: "lendInETH",
		outputs: [],
		stateMutability: "payable",
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
		name: "lendInWETH",
		outputs: [],
		stateMutability: "nonpayable",
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
		name: "liquidate",
		outputs: [],
		stateMutability: "nonpayable",
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
				name: "_amountToBorrow",
				type: "uint256",
			},
			{
				internalType: "uint8",
				name: "_expiryInDays",
				type: "uint8",
			},
			{
				internalType: "uint16",
				name: "_interestToPay",
				type: "uint16",
			},
		],
		name: "openContract",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "pause",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "paused",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_token",
				type: "address",
			},
		],
		name: "recoverToken",
		outputs: [],
		stateMutability: "nonpayable",
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
		name: "repayLoan",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "unpause",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_admin",
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
				internalType: "uint8",
				name: "_min",
				type: "uint8",
			},
			{
				internalType: "uint8",
				name: "_max",
				type: "uint8",
			},
		],
		name: "updateExpiryDays",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint16",
				name: "_securityFee",
				type: "uint16",
			},
			{
				internalType: "uint16",
				name: "_protocolFee",
				type: "uint16",
			},
		],
		name: "updateFee",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint16",
				name: "_minInterest",
				type: "uint16",
			},
			{
				internalType: "uint256",
				name: "_minBorrowAmount",
				type: "uint256",
			},
		],
		name: "updateInterestAndMinBorrowAmount",
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
				internalType: "address",
				name: "_TokenLocker",
				type: "address",
			},
		],
		name: "updateTokenLocker",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "withdrawLostBids",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;
