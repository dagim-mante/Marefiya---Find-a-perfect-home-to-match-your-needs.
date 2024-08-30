import { AssetWithFavouritesAndViews } from "@/lib/infer-type";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Link from "next/link";
import { Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
  

export default function AssetAnalytics({
    data: assets
}: {
    data: AssetWithFavouritesAndViews[]
}){
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Analytics</CardTitle>
                <CardDescription>Views and bookmarking analysis of your assets.</CardDescription>
            </CardHeader>
            <CardContent>
                <main className="grid lg:grid-cols-3 gap-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
                    {assets.map(asset => (
                        <Card key={asset.id}>
                            <CardHeader>
                                <CardTitle>
                                    <Link
                                      className="hover:text-primary"
                                      href={`/assets/${asset.id}`}
                                    >
                                        {asset.title}
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 border rounded-md flex flex-col items-center px-1">
                                        <Eye size={28} className="my-1"/>
                                        <p className="font-bold text-md">{asset.views.length} Views</p>
                                    </div>
                                    <div className="flex-1 border rounded-md flex flex-col items-center px-1">
                                        <Star size={28} className="my-1"/>
                                        <p className="font-bold text-md">{asset.favourites.length} Bookmarks</p>
                                    </div>
                                </div>
                                <Button className="mt-4" asChild>
                                    <Link href={`/dashboard/analytics/${asset.id}`}>Detail analytics</Link>
                                </Button>
                            </CardContent>
                      </Card>
                    ))}
                </main>
            </CardContent>
        </Card>
    )
}