import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuthLoading(){
    return (
        <Card className="h-[calc(100vh-9rem)] rounded-md py-10 px-5">
            <Skeleton className="w-60 h-10 mb-6"/>
            
            <div className="flex flex-col gap-2">
                <div>
                    <Skeleton className="w-20 h-5 mb-3"/>
                    <Skeleton className="w-full h-10"/>
                </div>
                <div>
                    <Skeleton className="w-20 h-5 mb-3"/>
                    <Skeleton className="w-full h-10"/>
                </div>
            </div>
            <Skeleton className="w-40 h-5 my-3"/>
            <Skeleton className="w-full h-10"/>
            <Skeleton className="w-full h-10 mt-5"/>
            <div className="flex justify-center">
                <Skeleton className="w-40 h-5 mt-5"/>
            </div>
        </Card>
    )
}