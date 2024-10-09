type ProtocolStatistics = {
  averageLoanAmount: string;
  largestLoan: string;
  totalLoanCount: number;
  totalLoanVolume: string;
  totalPaidInterest: string;
};

interface topcollectionType {
  id: string;
  name: string;
  loanStatistic: ProtocolStatistics;
  image: string;
  type?: "gif" | "image" | "avif" | "webp";
}

export const top_collection: topcollectionType[] = [
  {
    id: "1",
    name: "Mochimons",
    image: "/topcollections/MochimonsBanner.avif",
    type: "avif",
    loanStatistic: {
      averageLoanAmount: "NaN",
      largestLoan: "NaN",
      totalLoanCount: 0,
      totalLoanVolume: "NaN",
      totalPaidInterest: "NaN",
    },
  },
  {
    id: "2",
    name: "Based Fellas",
    image: "/topcollections/BaseFellasBanner.webp",
    type: "webp",
    loanStatistic: {
      averageLoanAmount: "NaN",
      largestLoan: "NaN",
      totalLoanCount: 0,
      totalLoanVolume: "NaN",
      totalPaidInterest: "NaN",
    },
  },
  {
    id: "3",
    name: "Neo Squiggles",
    image: "/topcollections/NeoSquigglesBanner.webp",
    type: "webp",
    loanStatistic: {
      averageLoanAmount: "NaN",
      largestLoan: "NaN",
      totalLoanCount: 0,
      totalLoanVolume: "NaN",
      totalPaidInterest: "NaN",
    },
  },
  {
    id: "4",
    name: "Based Apes",
    image: "/topcollections/BasedApeBanner.webp",
    type: "webp",
    loanStatistic: {
      averageLoanAmount: "NaN",
      largestLoan: "NaN",
      totalLoanCount: 0,
      totalLoanVolume: "NaN",
      totalPaidInterest: "NaN",
    },
  },
];
