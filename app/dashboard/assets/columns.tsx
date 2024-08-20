"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

type Asset = {
    id: number
    title: string
    image: string
    type: string
    price: number
}

export const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'image',
    header: 'Images',
    cell: ({row}) => {
        const cellImage = row.getValue('image') as string
        const cellTitle = row.getValue('title') as string
        return (
            <div>
                <Image
                    src={cellImage}
                    alt={cellTitle}
                    width={50}
                    height={50} 
                    className="rounded-md"
                />
            </div>
        )
    }
  },
  {
    accessorKey: 'type',
    header: 'Type'
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({row}) => {
        const price = parseFloat(row.getValue('price'))
        const formattedPrice = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(price)
        return (
            <div className="font-medium text-sm">
                {formattedPrice}
            </div>
        )
    }
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({row}) => {
        const asset = row.original
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button asChild variant={'ghost'} className="w-8 h-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
                        Edit Asset
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer">
                        Delete Asset
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  }
]
