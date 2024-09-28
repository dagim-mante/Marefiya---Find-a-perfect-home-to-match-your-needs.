import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard(){
    return (
        <div className="h-[calc(100vh-9rem)]">
            <div className="px-4 py-6 flex lg:flex-row flex-col gap-4">
                <Card className="px-4 py-6 h-96 flex-1 shrink-0">
                    <Skeleton className="w-60 h-10 mb-1"/>
                    <Skeleton className="w-72 h-5 mb-1"/>
                    <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="w-20 h-6 mb-3"/>
                        <Skeleton className="w-20 h-6 mb-3"/>
                    </div>
                    <div className="w-full h-full px-2">
                        <Skeleton className="w-full h-72"/>
                    </div>
                </Card>
                <Card className="px-4 py-6 h-96 flex-1 shrink-0">
                    <Skeleton className="w-60 h-10 mb-1"/>
                    <Skeleton className="w-72 h-5 mb-1"/>
                    <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="w-20 h-6 mb-3"/>
                        <Skeleton className="w-20 h-6 mb-3"/>
                    </div>
                    <div className="w-full h-full px-2">
                        <Skeleton className="w-full h-72"/>
                    </div>
                </Card>
            </div>
        </div>
    )
}