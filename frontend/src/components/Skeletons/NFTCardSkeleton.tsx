import React from "react";

import { Skeleton } from "../ui/skeleton";
// import { Line } from "../Homepage/TopCollections";
export default function NFTCardSkeleton({
  count = [1, 2, 3, 4],
}: {
  count?: number[];
}) {
  return (
    <div className="border border-[#022A32] bg-[#00090B] flex flex-col gap-2 items-center p-4 rounded-2xl">
      <div className="relative mb-6">
        <Skeleton className="w-[250px] h-[220px] rounded-lg overflow-hidden" />
        <Skeleton className="w-[200px] h-[40px] absolute bottom-[-16px] left-2/4 translate-x-[-50%]" />
      </div>

      <div className="w-full">
        {count.map((i) => (
          <div key={i}>
            <div className="flex items-center justify-between">
              <Skeleton className="w-[120px] h-[20px]" />
              <Skeleton className="w-[60px] h-[20px]" />
            </div>
            {/* {i !== count[count.length - 1] && <Line />} */}
          </div>
        ))}
      </div>
    </div>
  );
}
