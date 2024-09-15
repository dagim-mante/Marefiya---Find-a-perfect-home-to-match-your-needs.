'use server'
import { SettingsSchema } from "@/types/settings-schema"
import {createSafeActionClient} from "next-safe-action"
import { auth } from "../auth"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "../schema"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()
export const UpdateSettings = action
    .schema(SettingsSchema)
    .action(async ({parsedInput: values}) => {
        const session = await auth()
        if(!session) return {error: 'User not found.'}

        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        })
        if(!dbUser) return {error: 'User not found.'}

        if(session.user.isOAuth){
            values.email = undefined
            values.password = undefined
            values.newPassword = undefined
            values.isTwoFactorEnabled = undefined
        }

        if(values.password && values.newPassword && dbUser.password){
            const passwordMatch = await bcrypt.compare(values.password, dbUser.password)
            if(!passwordMatch) return {error: 'Password incorrect.'}
            const samePassword = await bcrypt.compare(values.newPassword, dbUser.password)
            if(samePassword) return {error: 'New password can\'t be same as the old password.'}

            const hashedPassword = await bcrypt.hash(values.newPassword, 10)
            values.password = hashedPassword
            values.newPassword = undefined
        }
        await db.update(users).set({
            twoFactorEnabled: values.isTwoFactorEnabled,
            name: values.name,
            password: values.password,
            email: values.email,
            image: values.image,
            bio: values.bio
        }).where(eq(users.id, dbUser.id))
        revalidatePath('/dashboard/settings')
        return {success: 'Settings updated.'}
    })