import { AssetWithFavouritesAndViews } from "@/lib/infer-type";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
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
                <main>  
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Bookmarks</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.map(asset => (
                                <TableRow key={asset.id}>
                                    <TableCell>{asset.id}</TableCell>
                                    <TableCell>{asset.title}</TableCell>
                                    <TableCell>{asset.views.length}</TableCell>
                                    <TableCell >{asset.favourites.length}</TableCell>
                                    <TableCell>
                                        <Button asChild variant='secondary'>
                                            <Link href={`/dashboard/analytics/${asset.id}`}>Details</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </main>
            </CardContent>
        </Card>
    )
}