'use client'

import { Skeleton } from "@/components/ui/skeleton"
import ClipLoader from "react-spinners/ClipLoader"

export default function Chatlayout(){
    return (
        <div className="h-[calc(100vh-9rem)]">
            <main className="relative w-full flex flex-col h-full">
            {/* Top Profile */}
            <div className="relative h-16">
              <div className="flex items-center p-3 border-b border-gray-300 dark:border-gray-700">
                <Skeleton className="w-5 h-5 mr-2"/>
                <div className="relative object-cover w-10 h-10 mr-2">
                    <Skeleton className="w-full h-full rounded-full" />
                </div>
                <Skeleton className="w-36 h-6" />
              </div>
            </div>
            
            <div className="flex justify-center items-center relative h-[calc(100vh-14.6rem)] ">
                <ClipLoader color="#0000ff" size={50} loading={true} />
            </div>
        </main>
        </div>
    )
} 