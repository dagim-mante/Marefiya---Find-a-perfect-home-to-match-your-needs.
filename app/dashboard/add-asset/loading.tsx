import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard(){
    return (
        <Card className="px-4 py-6 h-[calc(100vh-9rem)]">
            <Skeleton className="w-60 h-10 mb-1"/>
            <Skeleton className="w-72 h-5 mb-6"/>
            
            <div className="flex flex-col gap-6">
                <div>
                    <Skeleton className="w-20 h-5 mb-3"/>
                    <Skeleton className="w-full h-10"/>
                </div>
                <div>
                    <Skeleton className="w-20 h-5 mb-3"/>
                    <Skeleton className="w-full h-10 mb-1"/>
                    <Skeleton className="w-full h-20"/>
                </div>
                <div>
                    <Skeleton className="w-20 h-5 mb-3"/>
                    <Skeleton className="w-10 h-5 mb-2"/>
                    <Skeleton className="w-10 h-5"/>
                </div>
                <div>
                    <Skeleton className="w-20 h-5 mb-3"/>
                    <div className="flex items-center gap-1">
                        <Skeleton className="w-10 h-10 rounded-md"/>
                        <Skeleton className="w-full h-10"/>
                    </div>
                </div>
            </div>
            <Skeleton className="w-40 h-10 my-3"/>
        </Card>
    )
}