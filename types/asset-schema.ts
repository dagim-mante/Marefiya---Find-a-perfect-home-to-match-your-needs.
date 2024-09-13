import * as z from "zod"

export const AssetSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(4, {message: 'Title must be atleast 4 charchters.'}),
    description: z.string().min(40, {message: 'Description must be atleast 40 chrachters.'}),
    type: z.enum(["rent", "sell"]).nullable(),
    price: z.coerce.number({message: 'Price must be a number.'})
            .positive({message: 'Price must be postive.'}),
    rentType: z.enum(["night", "week", "month"]).nullable(),
    owner: z.string(),
    location: z.string(),
    latitude: z.number(),
    longitude: z.number()
})