import * as z from "zod"

export const RequestPasswordResetSchema = z.object({
    email: z
            .string()
            .email({
                message: 'Invalid Email.'
            }),
})