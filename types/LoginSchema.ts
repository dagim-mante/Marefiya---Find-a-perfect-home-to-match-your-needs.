import * as z from "zod"

export const LoginSchema = z.object({
    email: z
            .string()
            .email({
                message: 'Invalid Email.'
            }),
    password: z
                .string()
                .min(1, {
                    message: "Please input password"
                }),
    code: z
            .optional(z.string())
})