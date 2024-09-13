'use server'

import { AssetSchema } from "@/types/asset-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { and, eq } from "drizzle-orm"
import { assets } from "../schema"
import { revalidatePath } from "next/cache"
import { auth } from "../auth"

const action = createSafeActionClient()
export const CreateAsset = action
    .schema(AssetSchema)
    .action(async ({parsedInput: {id, title, description, type, price, owner, rentType, location, latitude, longitude}}) => {
        const session = await auth()
        if(!session || session?.user.role !== 'owner')return {error: 'You don\'t have access to this action.'}
        
        if(!title || !description || !type || !price || !owner || !location || !latitude || !longitude){
            return {error: 'Incomplete form.'}
        }
        console.log(id, title, description, type, price, owner, rentType)
        try{
            if(type === "sell"){
                rentType = null
            }
            if(id){
                const existingAsset = await db.query.assets.findFirst({
                    where: and(eq(assets.id, id), eq(assets.owner, owner))
                })
                if(!existingAsset) return {error: 'Asset not found'}
                const editedAsset = await db.update(assets).set({
                    title,
                    description,
                    type,
                    price,
                    rentType,
                    location,
                    latitude,
                    longitude
                }).where(
                    and(
                        eq(assets.id, id),
                        eq(assets.owner, owner)
                    )).returning()
                revalidatePath('/dashboard/assets')
                return {success: `Asset ${editedAsset[0].title} updated!`}
            }else{
                const newAsset = await db.insert(assets).values({
                    title,
                    description,
                    type,
                    price,
                    owner,
                    rentType,
                    location,
                    latitude,
                    longitude
                }).returning()
                revalidatePath('/dashboard/assets')
                return {success: `Asset ${newAsset[0].title} added!`}
            }
        }catch(err){
            return {error: 'Something went wrong.'}
        }
    })