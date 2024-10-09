import { Skeleton } from "../ui/skeleton";

export const GenericLoading = () => {
  return (
    <div className="flex flex-col w-full h-[150px] gap-2 justify-between">
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-4" />
    </div>
  );
};
