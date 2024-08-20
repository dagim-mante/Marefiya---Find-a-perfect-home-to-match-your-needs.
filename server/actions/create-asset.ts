'use server'

import { AssetSchema } from "@/types/asset-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { eq } from "drizzle-orm"
import { assets } from "../schema"

const action = createSafeActionClient()
export const CreateAsset = action
    .schema(AssetSchema)
    .action(async ({parsedInput: {id, title, description, type, price}}) => {
        if(!title || !description || !type || !price){
            return {error: 'Incomplete form.'}
        }
        try{
            if(id){
                const existingAsset = await db.query.assets.findFirst({
                    where: eq(assets.id, id)
                })
                if(!existingAsset) return {error: 'Asset not found'}
                const editedAsset = await db.update(assets).set({
                    title,
                    description,
                    type,
                    price
                }).where(eq(assets.id, id)).returning()
                return {success: `Asset ${editedAsset[0].title} updated!`}
            }else{
                const newAsset = await db.insert(assets).values({
                    title,
                    description,
                    type,
                    price
                }).returning()
                return {success: `Asset ${newAsset[0].title} added!`}
            }
        }catch(err){
            return {error: 'Something went wrong.'}
        }
    })