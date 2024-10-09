import React from "react";
// import { capKey } from "@/utils";
import { Skeleton } from "../ui/skeleton";

const pseudoProtocolData = {
  totalPaidInterest: "0",
  totalLoanVolume: "0",
  totalLoanCount: 0,
  largestLoan: "0",
  averageLoanAmount: "0",
};

interface ProtocolStatProps {
  showPseudo?: boolean;
}

export default function ProtocolStatSkeleton({
  showPseudo,
}: ProtocolStatProps) {
  return (
    <div className="text-white flex items-center justify-center mt-[-10vh] px-[5.5%] w-full">
      <div className="flex gap-4 w-full overflow-x-auto noScrollbar pb-1">
        {Object.entries(pseudoProtocolData).map(([key, value], i) => (
          <div
            key={i}
            className="flex bg-[#000000] shadow-lg border border-[#26243F] items-center w-full rounded-lg min-w-[180px]"
          >
            <div className="w-full bg-slate-500/10 text-white rounded-sm flex flex-col items-start p-3 relative">
              {showPseudo ? (
                <p className="text-[1.8rem] font-bold">{value as string}</p>
              ) : (
                <Skeleton className="w-[40px] h-[25px] my-1" />
              )}
              <p className="text-gray-400 font-thin whitespace-nowrap uppercase">
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
