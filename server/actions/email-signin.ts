'use server'

import { LoginSchema } from "@/types/LoginSchema"
import {createSafeActionClient} from "next-safe-action"
import {db} from "@/server"
import { eq } from "drizzle-orm"
import { twoFactorTokens, users } from "../schema"
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from "./tokens"
import { sendTwoFactorEmail, sendVerificationEmail } from "./email"
import { signIn } from "../auth"
import { AuthError } from "next-auth"


const action = createSafeActionClient()
export const LoginAction = action
    .schema(LoginSchema)
    .action(async ({parsedInput: {email, password, code}}) => {
        try{
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email)
            })
            if(!existingUser){
                return {error: 'Incorrect credentials.'}
            }
    
            if(!existingUser.emailVerified){
                const verificationToken = await generateEmailVerificationToken(existingUser.email)
                await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
                return {success: 'Email confirmation sent.'}
            }

            if(existingUser.twoFactorEnabled && existingUser.email){
                if(code){
                    const existingToken = await getTwoFactorTokenByEmail(existingUser.email)
                    if(!existingToken) return {error: 'Invalid token.'}
                    const hasExpired = new Date(existingToken.expires) < new Date()
                    if(hasExpired) return {error: 'Token expired.'}

                    if(code != existingToken.token) return {error: 'Incorrect token.'}

                    await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, existingToken.id))
                }else{
                    const newToken = await generateTwoFactorToken(existingUser.email)
                    if(!newToken) return {error: 'Token not generated.'}
                    await sendTwoFactorEmail(newToken[0].email, newToken[0].token)
                    return {twoFactorToken: 'Token email sent.'}
                }
            }
    
            await signIn('credentials', {
                email,
                password,
                redirectTo: '/'
            })
            return {success: 'Successfully signed in.'}
        }catch(error){
            if(error instanceof AuthError){
                switch(error.type){
                    case "CredentialsSignin":
                        return { error: "Email or Password Incorrect" }
                    case "AccessDenied":
                        return { error: error.message }
                    case "OAuthSignInError":
                        return { error: error.message }
                    default:
                        return { error: "Something went wrong" }
                }
            }
            throw error
        }
    })