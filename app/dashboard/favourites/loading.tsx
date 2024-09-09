import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard(){
    return (
        <Card className="px-4 py-6 h-[calc(100vh-9rem)]">
            <Skeleton className="w-60 h-10 mb-1"/>
            <Skeleton className="w-72 h-5 mb-6"/>
            
            <main className="max-w-screen-xl mx-auto p-4 sm:p-4 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {[1, 2, 3, 4 ,5 , 6].map(asset => (
                        <Skeleton key={asset} className="rounded h-64 w-full" />
                    ))}
                </div>
            </main>
        </Card>
    )
}