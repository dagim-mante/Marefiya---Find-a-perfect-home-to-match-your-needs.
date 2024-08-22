'use client'

import { AssetWithGalleryAndTagsSchema } from "@/types/assets-with-gallery-schema"
import { useFieldArray, useFormContext } from "react-hook-form"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
  
import { UploadDropzone } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import {Reorder} from "framer-motion"
import { useState } from "react"

export const AssetImagesUploader = () => {
    const {getValues, control, setError} = useFormContext<z.infer <typeof AssetWithGalleryAndTagsSchema>>()
    const {fields, remove, append, update, move} = useFieldArray({
        control,
        name: 'images'
    })
    const [active, setActive] = useState(0)

    return (
        <div>
            <FormField
                control={control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Image Gallery</FormLabel>
                    <FormControl>
                        <UploadDropzone
                            className="ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out border-secondary ut-button:bg-primary/75 ut-button:ut-readying:bg-secondary "
                            onUploadError={(error) => {
                                setError("images", {
                                    type: 'validate',
                                    message: error.message
                                })
                                return
                            }}
                            onBeforeUploadBegin={(files) => {
                                files.map(file => (
                                    append({
                                        name: file.name,
                                        size: file.size,
                                        url: URL.createObjectURL(file)
                                    })
                                ))
                                return files
                            }}
                            onClientUploadComplete={(files) => {
                                const images = getValues('images')
                                images.map((field, imgIndex) => {
                                    const image = files.find(img => img.name === field.name)
                                    if(image){
                                        update(imgIndex, {
                                            url: image.url,
                                            name: image.name,
                                            key: image.key,
                                            size: image.size
                                        })
                                    }
                                })
                                return
                            }}
                            config={{mode: 'auto'}}
                            endpoint="assetImages"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="rounden-md overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <Reorder.Group
                    as="tbody"
                    values={fields}
                    onReorder={(e) => {
                        const activeElement = fields[active]
                        e.map((item, index) => {
                            if(item === activeElement){
                                move(active, index)
                                setActive(index)
                                return
                            }
                            return
                        })
                    }}
                >
                    {fields.map((field, index) => {
                        return (
                            <Reorder.Item
                                as="tr"
                                onDragCapture={() => setActive(index)}
                                key={fields.id}
                                value={field}
                                id={field.id}
                                className={cn(
                                    field.url.search("blob:") === 0
                                    ? "animate-pulse transition-all"
                                    : "",
                                    "text-sm font-bold text-muted-foreground hover:text-primary"
                                )}
                            >
                                <TableCell>{index}</TableCell>
                                <TableCell>{field.name}</TableCell>
                                <TableCell>{(field.size / (1024 * 1024)).toFixed(2)} MB</TableCell>
                                <TableCell>
                                    <Image 
                                        src={field.url}
                                        alt={field.name}
                                        width={72}
                                        height={48}
                                        className='rounded-md'
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant={'ghost'}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            remove(index)
                                        }}
                                    >
                                        <Trash />
                                    </Button>
                                </TableCell>
                            </Reorder.Item>
                        )
                    })}
                </Reorder.Group>
            </Table>
            </div>
        </div>
    )
}