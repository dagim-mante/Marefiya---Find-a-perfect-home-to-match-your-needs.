import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard(){
    return (
        <div className="bg-gray-200 dark:bg-black/50 rounded-md h-[calc(100vh-9rem)]">
            <Skeleton className="w-full h-full" />
        </div>
    )
}