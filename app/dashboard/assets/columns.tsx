"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { deleteAsset } from "@/server/actions/delete-asset"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"

type Asset = {
    id: number
    title: string
    image: string
    type: string
    price: number
}

const ActionCell = ({row}: {row: Row<Asset>}) => {
    const {status, execute} = useAction(deleteAsset, {
        onSuccess: ({data}) => {
            if(data?.success){
                toast.success(data.success)
            }
            if(data?.error){
                toast.error(data.success)
            }
        },
        onExecute: () => {
            toast.loading('Deleting asset..')
        },
        onSettled: () => {
            toast.dismiss()
        },
        onError: () => {
            toast.error('Something went wrong.')
        }
    })

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
                    <Link href={`/dashboard/add-asset?id=${asset.id}`}>
                        Edit Asset
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
                    onClick={() => execute({id: asset.id})}
                >
                    Delete Asset
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
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
    cell: ActionCell
  }
]
