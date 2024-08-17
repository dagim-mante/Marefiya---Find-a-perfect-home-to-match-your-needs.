import * as z from "zod"

export const RegisterSchema = z.object({
    name: z.string().min(3, {
        message: 'Name must be atleast 3 charchters.'
    }),
    email: z.string().email(),
    password: z.string().min(8, {
        message: 'Password must be atleast 8 chaarchters.'
    })
})