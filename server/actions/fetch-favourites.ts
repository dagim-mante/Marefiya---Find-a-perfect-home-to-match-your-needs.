'use server'

import * as z from "zod"
import {createSafeActionClient} from 'next-safe-action'
import { auth } from '../auth'
import { db } from '..'
import { favourites } from '../schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

const action = createSafeActionClient()
export const FetchFavourites = action
    .schema(z.object({userId: z.string()}))
    .action(async ({parsedInput: {userId}}) => {
        const session = await auth()
        if(!session) return {error: 'Please sign in.'}
        if(session.user.id !== userId) return {error: 'you don\'t have access.'}
        try{
            const myFavourites = await db.query.favourites.findMany({
                where: eq(favourites.userId, userId)
            })
            revalidatePath("/search")
            return {success: myFavourites}
        }catch(err){
            return {error: 'Something went wrong.'}
        }
    })