import { gql } from "@apollo/client";

// Fragments
const loanContract = gql`
	fragment loanContract on loanContract {
		amount
		id
		interest
		expiry
		status
	}
`;
const lockID = gql`
	fragment lockID on lockId {
		tokens {
			tokenId
			
		}
		collection {
			id
			name
			symbol
		}
	}
`;

const accountStats = gql`
	fragment accountStats on accountStatistic {
		borrowCount
		defaultCount
		earnedInterest
		lendCount
		paidInterest
		totalBorrowedAmount
		totalLentAmount
	}
`;

const TX = gql`
	fragment TX on transaction {
		txType
		id
	}
`;

//LOANS /LOANID

export const GET_LOAN = gql`
	query MyQuery($ID: ID) {
		loanContract(id: $ID) {
			...loanContract
			status
			checkPointBlock
			lockId {
				...lockID
				transaction {
					...TX
				}
			}
			borrower {
				id
				accountStatistic {
					...accountStats
				}
			}
			bids {
				proposedInterest
				status
				bidder {
					id
				}
			}
			transactions {
				txType
				transactionFrom
				timestamp
				id
			}
		}
	}
	${loanContract}
	${accountStats}
	${TX}
	${lockID}
`;
//USER ACCOUNT(DASHBOARD)

export const GET_ACCOUNT = gql`
	query MyQuery($account: ID!) {
		account(id: $account) {
			id
			borrows {
				...tX
			}
			lends {
				...tX
			}
			loanBids {
				id
				status
				proposedInterest
				contract {
					id
					amount
					collection
					status
					expiry
				}
			}
			accountStatistic {
				...accountStats
			}
		}
	}
	fragment tX on loanContract {
		transactions {
			...TX
		}
		amount
		collection
		id
		interest
		status
		expiry
		checkPointBlock
		borrower {
			id
		}
		lender {
			id
		}
	}
	${accountStats}
	${TX}
`;

export const GET_LOANS = gql`
	query MyQuery {
		loanContracts{
			...loanContract
			lockId {
				...lockID
			}
		}
	}
	${loanContract}
	${lockID}
`;

export const GET_ACCOUNT_LOANS = gql`
	query MyQuery($account: String!, $status: LoanStatus) {
		account(id: $account) {
			borrows(where: { status: $status }) {
				...loanContract
				status
				lender {
					id
				}
				lockId {
					...lockID
				}
				checkPointBlock
				bids {
					proposedInterest
					bidder {
						id
					}
				}
			}
			lends(where: { status: $status }) {
				...loanContract
				status
				checkPointBlock
				borrower {
					id
				}
				lockId {
					...lockID
				}
			}
		}
	}
	${loanContract}
	${lockID}
`;
