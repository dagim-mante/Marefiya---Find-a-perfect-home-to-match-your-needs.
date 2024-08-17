'use server'
import { PasswordResetSchema } from '@/types/PasswordResetSchema'
import {createSafeActionClient} from 'next-safe-action'
import { getFromPasswordResetToken } from './tokens'
import { db } from '..'
import { eq } from 'drizzle-orm'
import { passwordResetTokens, users } from '../schema'
import bcrypt from "bcryptjs"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"

const action = createSafeActionClient()
export const PasswordResetAction = action
    .schema(PasswordResetSchema)
    .action(async ({parsedInput: {password, token}}) => {
        const pool = new Pool({ connectionString: process.env.POSTGRES_URL })
        const dbPool = drizzle(pool)
        if(!token){
            return {error: 'Missing token.'}
        }
        
        const existingToken = await getFromPasswordResetToken(token)
        if(!existingToken){
            return {error: 'Missing token.'}
        }
        
        const hasExpired = new Date(existingToken.expires) < new Date()
        if(hasExpired){
            return {error: 'Token has expired.'}
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, existingToken.email)
        })
        if(!existingUser){
            return {error: 'User doesn\'t exist.'}
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await dbPool.transaction(async (tx) => {
            await tx.update(users).set({
                email: existingUser.email,
                password: hashedPassword
            })
            await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
        })
        return {success: 'Password Updated'}
    })