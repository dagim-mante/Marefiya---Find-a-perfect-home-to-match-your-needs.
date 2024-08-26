import * as z from "zod"

export const ReviewsFormSchema = z.object({
    comment: z.string().min(1, {
        message: 'Please add a comment.'
    }),
    rating: z.number().min(1, {
        message: 'Please add atleast 1 star.'
    }).max(5, {
        message: 'You can\'t add more than 5 stars.'
    })
})