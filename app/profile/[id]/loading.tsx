import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading(){
    return (
        <main className="max-w-screen-xl mx-auto sm:p-4 md:p-8">
            <section className="relative pt-40 pb-24">
                <div className="bg-gray-200 w-full dark:bg-black/50 absolute top-0 left-0 z-0 h-60"/>
                <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
                    <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
                            <Skeleton className="w-36 h-36 rounded-full" />
                    </div>
                    <div className="flex items-center justify-center flex-col sm:flex-row max-sm:gap-5 sm:justify-between mb-3">
                        <div className="block">
                            <Skeleton className="h-10 w-48 mb-1 max-sm:text-center" / >
                            <Skeleton className="max-sm:text-center w-80 h-16" />
                        </div>
                    </div>
                    <div>
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
                </div>
            </section>                                 
        </main>
    )
}