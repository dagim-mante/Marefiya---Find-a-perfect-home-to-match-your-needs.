import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssetLayout(){
    return (
    <main>
        <div className="p-4 lg:max-w-7xl max-w-xl max-lg:mx-auto">
            <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-3">
                <div className="min-h-[300px] lg:col-span-3 rounded-lg w-full lg:sticky top-0 text-center lg:p-6">
                    <Skeleton className="w-full min-h-[300px]" />
                </div>

                <div className="lg:col-span-2">
                    <Skeleton className="w-72 h-10 mb-1"/>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <Skeleton className="w-56 h-8"/>
                        <Skeleton className="w-20 h-8 rounded-full"/>
                    </div>

                    <div className="flex space-x-2 mt-4">
                        <Skeleton className="w-32 h-5"/>
                        <Skeleton className="w-20 h-5"/>
                    </div>
                    <Separator className="my-2"/>
                    <div className="flex items-center gap-1">
                        <Skeleton className="w-16 h-16 rounded-full"/>
                        <Skeleton className="w-20 h-8"/>
                    </div>

                    <div className="mt-4">
                        <Skeleton className="w-64 h-8 mb-2"/>
                        <Skeleton className="w-full h-48"/>
                    </div>               
                </div>

            </div>
        </div>
        <div className="mt-4">
            <Skeleton className="w-64 h-10"/>
            <section className="py-4">
                <div className="flex gap-2 lg:gap-12 justify-stretch lg:flex-row flex-col">
                    <div className="flex-1">
                        <div className="w-full">
                            <Skeleton className="w-full h-10"/>
                        </div>
                        <div className="flex flex-col gap-4 my-2">
                            {[1, 2, 3, 4].map(review => (
                                <Card key={review} className="p-4">
                                    <div className="flex gap-2 items-center">
                                        <Skeleton className="w-12 h-12 rounded-full"/>
                                        <div>
                                            <Skeleton className="w-36 h-8 mb-2"/>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="w-20 h-5"/>
                                                <Skeleton className="w-12 h-5"/>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Skeleton className="py-2 w-full h-12 mt-2" />
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <Card className="flex flex-col p-8 rounded-md gap-4">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="w-64 h-10"/>
                                <Skeleton className="w-20 h-5"/>
                            </div>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <div key={rating} className="flex gap-2 justify-between items-center">
                                    <Skeleton className="w-10 h-5"/>
                                    <Skeleton className="w-full h-5"/>
                                    <Skeleton className="w-16 h-5"/>
                                </div>
                            ))}
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    </main>
    )
}