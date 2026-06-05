import { Skeleton } from "@/components/ui/skeleton";

const ItemSkeleton = () => {
  return (
    <div className="w-full rounded-xl border p-3">
      {/* Product Image */}
      <Skeleton className="relative min-h-75 flex flex-col justify-between pt-0 pb-1 w-full rounded-lg shimmer" />

      {/* Author Section */}
      <div className="flex items-center gap-3 mt-4">
        <Skeleton className="h-8 w-8 rounded-full shimmer" />
        <Skeleton className="h-4 w-24 rounded-md shimmer" />
      </div>

      {/* Product Title */}
      <Skeleton className="mt-3 h-4 w-3/4 rounded-md shimmer" />
    </div>
  );
};

export const ItemSkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ItemSkeleton key={i} />
      ))}
    </div>
  );
};
