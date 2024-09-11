'use client'

import { AssetWithImagesAndTagsTable } from "@/lib/infer-type"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AssetWithGalleryAndTagsSchema } from "@/types/assets-with-gallery-schema"
import {InputTags} from "./input-tags"  
import {AssetImagesUploader} from "./asset-images-upload"
import { useAction } from "next-safe-action/hooks"
import { CreateGalleryAndTags } from "@/server/actions/asset-with-gallery"
import { toast } from "sonner"
import {useEffect, useState} from "react"

export const EditorWrapper = ({
    editMode,
    galleryAndTags,
    assetId,
    children
}: {
    editMode: boolean,
    galleryAndTags: AssetWithImagesAndTagsTable,
    assetId: number,
    children: React.ReactNode
}) => {
    const form = useForm<z.infer<typeof AssetWithGalleryAndTagsSchema>>({
        resolver: zodResolver(AssetWithGalleryAndTagsSchema),
        defaultValues: {
            editMode,
            images: [],
            tags: [],
            id: assetId,
            assetId
        }
    })

    const {status, execute} = useAction(CreateGalleryAndTags, {
        onExecute: () => {
            toast.loading('Updating Gallery and Tags.')
        },
        onSuccess: ({data}) => {
            if(data?.success){
                toast.success(data.success)
            }
            if(data?.error){
                toast.error(data.error)
            }
        },
        onSettled: () => {
            setOpen(false)
            toast.dismiss()
        }
    })

    const onSubmit = (values: z.infer<typeof AssetWithGalleryAndTagsSchema>) => {
        execute(values)
    }

    const [open, setOpen] = useState(false)
    const setEdit = () => {
        if(!editMode){
            form.reset()
            return
        }else{
            if(galleryAndTags){
                form.setValue('editMode', editMode)
                form.setValue('id', assetId)
                form.setValue('assetId', galleryAndTags.id)
                form.setValue('images', galleryAndTags.assetImages.map(assetImage => ({
                    name: assetImage.name,
                    url: assetImage.url,
                    size: assetImage.size
                })))
                form.setValue('tags', galleryAndTags.assetTags.map(assetTag => assetTag.tag))
            }
        }
    }

    useEffect(() => {
        setEdit()
    }, [editMode])


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="md:max-w-screen-md lg:max-w-screen-lg sm:max-w-screen-sm rounded-md overflow-y-scroll max-h-[520px]">
                <DialogHeader>
                <DialogTitle>{editMode ? 'Edit' : 'Create' } Gallery and Tags</DialogTitle>
                <DialogDescription>
                    Create and edit the gallery and tags for your asset.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <InputTags {...field} onChange={(e) => field.onChange(e)}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <AssetImagesUploader />
                        <Button 
                            disabled={
                                status === 'executing' || 
                                !form.formState.isValid ||
                                !form.formState.isDirty
                            }
                            type="submit"
                        >
                            {editMode ? 'Save changes' : 'Add to asset'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}