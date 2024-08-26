'use client'
import { ReviewsFormSchema } from "@/types/reviews-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"

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
import { Textarea } from "../ui/textarea"
import {motion} from "framer-motion"
import { Star } from "lucide-react"
import {cn} from "@/lib/utils"

export default function ReviewsForm(){
    const form =  useForm<z.infer <typeof ReviewsFormSchema>>({
        resolver: zodResolver(ReviewsFormSchema),
        defaultValues: {
            comment: '',
            rating: 0
        }
    })

    const onSubmit = (values: z.infer<typeof ReviewsFormSchema>) => {
        console.log(values)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="w-full">
                    <Button className="font-medium w-full" variant={'secondary'}>
                        Leave a review
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Leave a review</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="Your comment..."
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Leave your rating</FormLabel>
                            <FormControl>
                            <Input
                                type="hidden"
                                placeholder="Your comment..."
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(value => (
                                    <motion.div
                                        className="relative cursor-pointer"
                                        whileHover={{scale: 1.2}}
                                        whileTap={{scale: 0.8}}
                                        key={value}
                                    >
                                        <Star 
                                            key={value}
                                            className={cn(
                                                "text-primary bg-transparent transition-all duration-300 ease-in-out",
                                                form.getValues("rating") >= value
                                                  ? "fill-primary"
                                                  : "fill-muted"
                                            )}
                                            onClick={() => form.setValue('rating', value)}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">
                        Add Review
                    </Button>
                </form>
            </Form>
            </PopoverContent>
        </Popover>
    )
}