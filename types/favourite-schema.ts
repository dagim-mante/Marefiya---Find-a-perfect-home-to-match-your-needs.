import * as z from "zod"

export const favouriteSchema = z.object({
    id: z.number().optional(),
    userId: z.string(),
    assetId: z.number()
})