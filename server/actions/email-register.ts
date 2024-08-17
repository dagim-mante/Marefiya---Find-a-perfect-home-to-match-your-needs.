'use server'
import { RegisterSchema } from "@/types/RegisterSchema"
import {createSafeActionClient} from "next-safe-action"
import {db} from '@/server'
import bcrypt from 'bcryptjs'
import { eq } from "drizzle-orm"
import { users } from "../schema"
import { generateEmailVerificationToken } from "./tokens"
import { sendVerificationEmail } from "./email"

const action = createSafeActionClient()
export const RegisterAction = action
    .schema(RegisterSchema)
    .action(async ({parsedInput: {name, email, password}}) => {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })
        if(existingUser){
            if(!existingUser.emailVerified){
                const verificationToken = await generateEmailVerificationToken(email)
                await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
                return {success: 'Verification email resent.'}
            }
            return {error: 'Email Already in use'}
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await db.insert(users).values({
            email,
            name,
            password: hashedPassword,  
        })
        const verificationToken = await generateEmailVerificationToken(email)
        await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
        return {success: 'Verification email sent.'}
    })