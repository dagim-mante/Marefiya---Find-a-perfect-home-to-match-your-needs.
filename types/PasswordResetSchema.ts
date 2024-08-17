import * as z from "zod"

export const PasswordResetSchema = z.object({
    password: z
                .string()
                .min(3, {
                    message: "Please must be atleast 8 characters."
                }),
    token: z
            .string()
            .nullable()
            .optional()
})