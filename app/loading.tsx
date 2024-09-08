import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading(){
    return (
        <div className="flex-grow px-6 md:px-12 mx-auto max-w-7xl">
            {/* Hero */}
            <div className="bg-gray-200 dark:bg-black/50 rounded-md">
                <div className="dark:bg-transparent">
                <div className="mx-auto flex flex-col items-center py-12 sm:py-24">
                    <div className="h-full w-11/12 sm:w-2/3 flex justify-center items-center flex-col mb-3 sm:mb-10">
                        <Skeleton className="h-12 w-3/5" />
                        <Skeleton className="h-8 w-1/5 sm:mt-5 mt-3" />
                    </div>
                    <div className="flex justify-center w-11/12 md:w-8/12 xl:w-6/12">
                        <div className="flex justify-center rounded-md w-full">
                            <div className="w-full flex justify-center ">
                                <Skeleton className="h-10 w-4/5 sm:mt-5" />
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>

             {/* Discover  */}
             <div className="w-1/5">
                <Skeleton className="h-10 w-25 mt-10" />
             </div>
            <main className="max-w-screen-xl mx-auto px-1 py-4 sm:p-4 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {[1, 2, 3, 4 ,5 , 6].map(asset => (
                        <Skeleton key={asset} className="rounded h-64 w-full" />
                    ))}
                </div>
            </main>
        </div>
    ) 
}