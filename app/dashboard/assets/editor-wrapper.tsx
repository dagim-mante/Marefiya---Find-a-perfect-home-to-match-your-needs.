'use client'

import { AssetWithImagesAndTags } from "@/lib/infer-type"
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

export const EditorWrapper = ({
    editMode,
    galleryAndTags,
    children
}: {
    editMode: boolean,
    galleryAndTags: AssetWithImagesAndTags,
    children: React.ReactNode
}) => {
    const form = useForm<z.infer<typeof AssetWithGalleryAndTagsSchema>>({
        resolver: zodResolver(AssetWithGalleryAndTagsSchema),
        defaultValues: {
            editMode,
            images: [],
            tags: [],
            id: undefined
        }
    })

    const onSubmit = (values: z.infer<typeof AssetWithGalleryAndTagsSchema>) => {
        console.log(values)
    }
    return (
        <Dialog>
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
                        <Button type="submit">
                            {editMode ? 'Save changes' : 'Add to asset'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}