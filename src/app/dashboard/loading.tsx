import { CardSkeleton, TableSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-96 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <CardSkeleton />
      <TableSkeleton />
    </div>
  );
}
