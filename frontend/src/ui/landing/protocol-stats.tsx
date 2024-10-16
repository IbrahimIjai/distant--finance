import React from "react";
const mockProtocolStats = {
  averageLoanAmount: "--",
  largestLoan: "--",
  totalLoanCount: 0,
  totalLoanVolume: "--",
  totalPaidInterest: "--",
};
export default function ProtocolStats() {
  return (
    <div className="text-white flex items-center justify-center mt-[-14vh] px-[5%] w-full">
      <div
        className={`flex gap-4 w-full overflow-x-auto noScrollbar pb-1 flex-wrap lg:flex-nowrap flex-row justify-between`}
      >
        {Object.entries(mockProtocolStats).map(([key, value], i) => (
          <div
            key={i}
            className="flex bg-[#000000] shadow-lg border border-[#26243F] items-center w-full rounded-lg min-w-[180px]"
          >
            <div className="w-full bg-slate-500/10 text-white rounded-sm flex flex-col items-start p-3 relative">
              <p className="text-[1.8rem] font-bold">{value as string}</p>
              <p className="text-gray-400 font-thin whitespace-nowrap uppercase text-sm lg:text-normal">
                {key}
              </p>
              <span className="absolute top-3 right-3 w-3 rounded-full bg-[#26243F] h-3"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
