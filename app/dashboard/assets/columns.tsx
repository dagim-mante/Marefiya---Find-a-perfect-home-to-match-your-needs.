"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { FilePenLine, ImagePlus, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
  
import { deleteAsset } from "@/server/actions/delete-asset"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { AssetWithImagesAndTagsTable } from "@/lib/infer-type"
import {EditorWrapper} from "./editor-wrapper"
import { formatPrice } from "@/lib/utils"

type Asset = {
    id: number
    title: string
    imageGalleryAndTags: AssetWithImagesAndTagsTable
    type: string
    price: number,
    rentType: string | null
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
    accessorKey: 'imageGalleryAndTags',
    header: 'Gallery & Tags',
    cell: ({row}) => {
        const galleryAndTags = row.getValue('imageGalleryAndTags') as AssetWithImagesAndTagsTable
        let imagesAndtagsExists = true
        if(galleryAndTags.assetImages.length === 0){
            imagesAndtagsExists = false
        }
        if(galleryAndTags.assetTags.length === 0){
            imagesAndtagsExists = false
        }
        return (
            <div>
                { imagesAndtagsExists ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <EditorWrapper 
                                        editMode={true}
                                        galleryAndTags={galleryAndTags}
                                        assetId={row.original.id}
                                    >
                                        <FilePenLine className="w-5 h-5 rounded-full" />
                                    </EditorWrapper>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit gallery and tags.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <EditorWrapper 
                                        editMode={false}
                                        assetId={row.original.id}
                                        galleryAndTags={galleryAndTags}
                                    >
                                        <ImagePlus className="w-5 h-5 rounded-full"/>
                                    </EditorWrapper>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Create gallery and tags.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

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
        const formattedPrice = formatPrice(price, row.original.type, row.original.rentType)
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
