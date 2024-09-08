import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export default function Dashboard(){
    return (
        <div className="px-4 py-6 h-[calc(100vh-9rem)]">
            <Skeleton className="w-60 h-10 mb-1"/>
            <Skeleton className="w-72 h-5 mb-6"/>
            
            <Skeleton className="w-full h-10 mb-1"/>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Skeleton className="w-12 h-6 mb-1"/>
                        </TableHead>
                        <TableHead>
                            <Skeleton className="w-12 h-6 mb-1"/>
                        </TableHead>
                        <TableHead>
                            <Skeleton className="w-12 h-6 mb-1"/>
                        </TableHead>
                        <TableHead>
                            <Skeleton className="w-12 h-6 mb-1"/>
                        </TableHead>
                        <TableHead>
                            <Skeleton className="w-12 h-6 mb-1"/>
                        </TableHead>
                        <TableHead>
                            <Skeleton className="w-12 h-6 mb-1"/>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2, 3, 4].map(cell => (
                        <TableRow key={cell}>
                            <TableCell>
                                <Skeleton className="w-16 h-6 mb-1"/>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="w-16 h-6 mb-1"/>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="w-16 h-6 mb-1"/>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="w-16 h-6 mb-1"/>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="w-16 h-6 mb-1"/>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="w-16 h-6 mb-1"/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}