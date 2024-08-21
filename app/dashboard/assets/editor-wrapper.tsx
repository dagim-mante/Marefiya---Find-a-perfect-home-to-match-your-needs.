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
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AssetWithGalleryAndTagsSchema } from "@/types/assets-with-gallery-schema"
  
export default function EditorWrapper({
    editMode,
    galleryAndTags,
    children
}: {
    editMode: boolean,
    galleryAndTags: AssetWithImagesAndTags,
    children: React.ReactNode
}){
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
            <DialogContent>
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
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            {editMode ? 'Save changes' : 'Add to asset'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}