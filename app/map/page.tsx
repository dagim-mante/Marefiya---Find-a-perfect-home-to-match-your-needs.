'use client'

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import SearchLocation from "./search-location";


export default function Page() {
    const Map = useMemo(() => dynamic(
        () => import('@/components/map/'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])
    const [selectPosition, setSelectPosition] = useState(null)

    return (
        <>
            <div className="flex gap-2 bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
                <SearchLocation setSelectPosition={setSelectPosition} />
                <Map selectPosition={selectPosition} posix={[8.855170802198643, 38.80318219437807]} />
            </div>
        </>
    )
}