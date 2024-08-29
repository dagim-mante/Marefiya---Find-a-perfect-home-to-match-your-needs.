'use server'

import { favouriteSchema } from '@/types/favourite-schema'
import {createSafeActionClient} from 'next-safe-action'
import { auth } from '../auth'
import { db } from '..'
import { favourites } from '../schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

const action = createSafeActionClient()
export const removedFavourite = action
    .schema(favouriteSchema)
    .action(async ({parsedInput: {id}}) => {
        const session = await auth()
        if(!session) return {error: 'Please sign in.'}
        try{
            const removedFavourite = await db.delete(favourites).where(eq(favourites.id, id!))
            revalidatePath("/")
            return {success: `Removed from favourites!`}
        }catch(err){
            return {error: 'Something went wrong.'}
        }
    })