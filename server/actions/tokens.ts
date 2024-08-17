'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { emailTokens, passwordResetTokens, twoFactorTokens, users } from "../schema"
import crypto from "crypto"

export const getVerificationTokenByEmail = async (email: string) => {
    try{
        const existingToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.email, email)
        })
        return existingToken
    }catch(error){
        return null
    }
}

export const generateEmailVerificationToken = async (email: string) => {
    const token = crypto.randomUUID()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getVerificationTokenByEmail(email)
    if(existingToken){
        await db.delete(emailTokens).where(eq(emailTokens.email, email))
    }
    const verificationToken = await db.insert(emailTokens).values({
        email,
        token,
        expires
    }).returning()
    return verificationToken
}

export const newVerification = async (token: string) => {
    const existingToken = await db.query.emailTokens.findFirst({
        where: eq(emailTokens.token, token)
    })
    if(!existingToken) return {error: 'No token found.'}
    const hasExpired = new Date(existingToken.expires) < new Date()
    if(hasExpired) return {error: 'Token has expired.'}
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })
    if(!existingUser) return {error: 'User doesn\'t exist.'}
    await db.update(users).set({
        emailVerified: new Date(),
        email: existingUser.email
    })
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
    return {success: 'Email verified.'}
}

export const getFromPasswordResetToken = async (token: string) => {
    try{
        const result = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token)
        })
        return result
    }catch(error){
        return null
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try{
        const token = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.email, email)
        })
        return token
    }catch(error){
        return null
    }
}

export const generatePasswordResetToken = async (email: string) => {
    const token = crypto.randomUUID()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getPasswordResetTokenByEmail(email)
    if(existingToken){
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.email, email))
    }
    const passwordResetToken = await db.insert(passwordResetTokens).values({
        email,
        token,
        expires
    }).returning()
    return passwordResetToken
}
 

export const getTwoFactorTokenByEmail = async (email: string) => {
    try{
        const token = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.email, email)
        })
        return token
    }catch(error){
        return null
    }
}

export const getTwoFactorTokenByToken = async (token: string) => {
    try{
        const result = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.token, token)
        })
        return result
    }catch(error){
        return null
    }
}

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getTwoFactorTokenByEmail(email)
    if(existingToken){
        await db.delete(twoFactorTokens).where(eq(twoFactorTokens.email, email))
    }
    const twoFactorToken = await db.insert(twoFactorTokens).values({
        email,
        token,
        expires
    }).returning()
    return twoFactorToken
}