"use server"
import * as z from "zod"
import {createSafeActionClient} from "next-safe-action"
import { auth } from "../auth"
import { db } from ".."
import { assets } from "../schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()
export const deleteAsset = action
    .schema(z.object({id: z.number()}))
    .action(async ({parsedInput: {id}}) => {
        const session = await auth()
        if(!session || session?.user.role !== 'owner')return {error: 'You don\'t have access to this action.'}
        try{
            const deletedAsset = await db.delete(assets)
                                    .where(and(eq(assets.id, id), eq(assets.owner, session.user.id)))
                                    .returning()
            revalidatePath('/dashboard/assets')
            return {success: `Asset ${deletedAsset[0].title} deleted.`}
        }catch(err){
            return {error: 'Something went wrong.'}
        }
    })