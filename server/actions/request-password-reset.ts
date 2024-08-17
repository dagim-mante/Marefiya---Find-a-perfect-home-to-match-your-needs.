'use server'
import { RequestPasswordResetSchema } from "@/types/RequestPasswordResetSchema"
import {createSafeActionClient} from "next-safe-action"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "../schema"
import { generatePasswordResetToken } from "./tokens"
import { sendPasswordResetEmail } from "./email"

const action = createSafeActionClient()
export const RequestPasswordResetAction = action
    .schema(RequestPasswordResetSchema)
    .action(async ({parsedInput: {email}}) => {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })
        if(!existingUser){
            return {error: 'No account exists with thie email.'}
        }

        const passwordResetToken = await generatePasswordResetToken(existingUser.email)
        if(!passwordResetToken){
            return {error: 'Token could not be generated'}
        }
        await sendPasswordResetEmail(passwordResetToken[0].email, passwordResetToken[0].token)
        return {success: 'Password reset email sent.'}
    })