'use client'

import { AssetWithFavouritesAndViews } from "@/lib/infer-type"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { useMemo } from "react"
import {  monthlychart, monthlychartbookmark, weeklyChart, weeklyChartBookmark } from "./utils"
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

export default function GraphAnalytics({
    data
}:{
    data: AssetWithFavouritesAndViews
}){
    const router = useRouter()
    const searchParams = useSearchParams()
    const viewfilter = searchParams.get('viewFilter') || 'week'
    const bookmarkfilter = searchParams.get('bookmarkfilter') || 'week'

    const viewchartItems = data.views.map(view => ({
        date: view.created!,
        view: 1
    }))
    const bookmarkchartItems = data.favourites.map(view => ({
        date: view.created!,
        bookmark: 1
    }))

    const viewActiveChart = useMemo(() => {
        const weekly = weeklyChart(viewchartItems)
        const monthly = monthlychart(viewchartItems)
        if(viewfilter === 'week'){
            return weekly
        }
        if(viewfilter === 'month'){
            return monthly
        }
    }, [viewfilter])
    const bookmarkActiveChart = useMemo(() => {
        const weekly = weeklyChartBookmark(bookmarkchartItems)
        const monthly = monthlychartbookmark(bookmarkchartItems)
        if(bookmarkfilter === 'week'){
            return weekly
        }
        if(bookmarkfilter === 'month'){
            return monthly
        }
    }, [bookmarkfilter])

    const viewActiveTotal = useMemo(() => {
        if(viewfilter == 'month'){
            return monthlychart(viewchartItems).reduce((acc, i) => acc + i.views, 0)
        }
        return weeklyChart(viewchartItems).reduce((acc, i) => acc + i.views, 0)
    }, [viewfilter]) 
    const bookmarkActiveTotal = useMemo(() => {
        if(bookmarkfilter == 'month'){
            return monthlychartbookmark(bookmarkchartItems).reduce((acc, i) => acc + i.bookmarks, 0)
        }
        return weeklyChartBookmark(bookmarkchartItems).reduce((acc, i) => acc + i.bookmarks, 0)
    }, [bookmarkfilter]) 
    
    return (
        <div className="flex lg:flex-row flex-col">
            <Card className="flex-1 shrink-0 h-full">
            <CardHeader>
                <CardTitle>Your Views: {viewActiveTotal}</CardTitle>
                <CardDescription>Here are your recent views</CardDescription>
                <div className="flex items-center gap-2 pb-4">
                <Badge
                    className={cn(
                    "cursor-pointer",
                    viewfilter === "week" ? "bg-primary" : "bg-primary/25"
                    )}
                    onClick={() =>
                    router.push(`/dashboard/analytics/${data.id}?viewFilter=week&bookmarkfilter=${bookmarkfilter}`, {
                        scroll: false,
                    })
                    }
                >
                    This Week
                </Badge>
                <Badge
                    className={cn(
                    "cursor-pointer",
                    viewfilter === "month" ? "bg-primary" : "bg-primary/25"
                    )}
                    onClick={() =>
                    router.push(`/dashboard/analytics/${data.id}?viewFilter=month&bookmarkfilter=${bookmarkfilter}`, {
                        scroll: false,
                    })
                    }
                >
                    This Month
                </Badge>
                </div>
                <CardContent className="h-96">
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <BarChart data={viewActiveChart}>
                    <Tooltip
                        content={(props) => (
                        <div>
                            {props.payload?.map((item) => {
                            return (
                                <div
                                className="bg-primary text-white py-2 px-4 rounded-md shadow-lg"
                                key={item.payload.date}
                                >
                                <p>Views: {item.value}</p>
                                <p>Date: {item.payload.date}</p>
                                </div>
                            )
                            })}
                        </div>
                        )}
                    />
                    <YAxis dataKey="views" />
                    <XAxis dataKey="date" />
                    <Bar dataKey="views" className="fill-primary" />
                    </BarChart>
                </ResponsiveContainer>
                </CardContent>
            </CardHeader>
            </Card>
            <Card className="flex-1 shrink-0 h-full">
            <CardHeader>
                <CardTitle>Your Bookmarks: {bookmarkActiveTotal}</CardTitle>
                <CardDescription>Here are your recent views</CardDescription>
                <div className="flex items-center gap-2 pb-4">
                <Badge
                    className={cn(
                    "cursor-pointer",
                    bookmarkfilter === "week" ? "bg-primary" : "bg-primary/25"
                    )}
                    onClick={() =>
                    router.push(`/dashboard/analytics/${data.id}?bookmarkfilter=week&viewFilter=${viewfilter}`, {
                        scroll: false,
                    })
                    }
                >
                    This Week
                </Badge>
                <Badge
                    className={cn(
                    "cursor-pointer",
                    bookmarkfilter === "month" ? "bg-primary" : "bg-primary/25"
                    )}
                    onClick={() =>
                    router.push(`/dashboard/analytics/${data.id}?bookmarkfilter=month&viewFilter=${viewfilter}`, {
                        scroll: false,
                    })
                    }
                >
                    This Month
                </Badge>
                </div>
                <CardContent className="h-96">
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <BarChart data={bookmarkActiveChart}>
                    <Tooltip
                        content={(props) => (
                        <div>
                            {props.payload?.map((item) => {
                            return (
                                <div
                                className="bg-primary text-white py-2 px-4 rounded-md shadow-lg"
                                key={item.payload.date}
                                >
                                <p>Bookmarks: {item.value}</p>
                                <p>Date: {item.payload.date}</p>
                                </div>
                            )
                            })}
                        </div>
                        )}
                    />
                    <YAxis dataKey="bookmarks" />
                    <XAxis dataKey="date" />
                    <Bar dataKey="bookmarks" className="fill-primary" />
                    </BarChart>
                </ResponsiveContainer>
                </CardContent>
            </CardHeader>
            </Card>
        </div>
    ) 
}