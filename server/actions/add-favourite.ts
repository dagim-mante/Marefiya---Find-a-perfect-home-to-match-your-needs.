'use server'

import { favouriteSchema } from '@/types/favourite-schema'
import {createSafeActionClient} from 'next-safe-action'
import { auth } from '../auth'
import { db } from '..'
import { favourites } from '../schema'
import { revalidatePath } from 'next/cache'

const action = createSafeActionClient()
export const createFavourite = action
    .schema(favouriteSchema)
    .action(async ({parsedInput: {assetId, userId}}) => {
        const session = await auth()
        if(!session) return {error: 'Please sign in.'}
        try{
            const newFavourite = await db.insert(favourites).values({
                userId,
                assetId
            })
            revalidatePath("/")
            return {success: `Added to favourites!`}
        }catch(err){
            return {error: 'Something went wrong.'}
        }
    })