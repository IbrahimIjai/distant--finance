import { gql } from "@apollo/client";

// Fragments
const loanContract = gql`
	fragment loanContract on loanContract {
		amount
		id
		interest
		expiry
	}
`;
const lockID = gql`
	fragment lockID on lockId {
		tokens {
			tokenId
			tokenURI
		}
		collection {
			id
			name
			symbol
		}
	}
`;

//USER ACCOUNT(DASHBOARD)

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
