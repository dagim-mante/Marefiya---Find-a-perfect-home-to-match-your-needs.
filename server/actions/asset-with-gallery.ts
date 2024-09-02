'use server'

import { AssetWithGalleryAndTagsSchema } from "../../types/assets-with-gallery-schema"
import { createSafeActionClient } from "next-safe-action"
import { assetImages, assets, assetTags } from "../schema"
import { eq } from "drizzle-orm"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import { revalidatePath } from "next/cache"
import algoliasearch from "algoliasearch"
import { db } from ".."
import { auth } from "../auth"

const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_ID!,
    process.env.ALGOLIA_ADMIN!
)
const algoliaIndex = client.initIndex('assets')
const algoliaQuerySuggest = client.initIndex('assets_query_suggestions')

const action = createSafeActionClient()
export const CreateGalleryAndTags = action
    .schema(AssetWithGalleryAndTagsSchema)
    .action(async ({parsedInput: {id, assetId, editMode, tags, images}}) => {
        const pool = new Pool({ connectionString: process.env.POSTGRES_URL })
        const dbPool = drizzle(pool)
        const session = await auth()
        if(!session || session?.user.role !== 'owner')return {error: 'You don\'t have access to this action.'}
        try{
            if(editMode && assetId){
                await dbPool.transaction(async (tx) => {
                    await tx.delete(assetTags).where(eq(assetTags.assetId, assetId))
                    await tx.insert(assetTags).values(
                        tags.map(tag => ({
                            tag,
                            assetId
                        }))
                    )
                    
                    await tx.delete(assetImages).where(eq(assetImages.assetId, assetId))
                    await tx.insert(assetImages).values(
                        images.map((image, imgIndex) => ({
                            name: image.name,
                            size: image.size,
                            url: image.url,
                            order: imgIndex,
                            assetId
                        }))
                    )
                })
                const newAsset = await db.query.assets.findFirst({
                    where: eq(assets.id, assetId)
                })
                if(newAsset){
                    algoliaIndex.partialUpdateObject({
                        objectID: newAsset.id.toString(),
                        id: newAsset.id,
                        title: newAsset.title,
                        description: newAsset.description,
                        price: newAsset.price,
                        type: newAsset.type
                    })
                    algoliaQuerySuggest.saveObject({
                        objectID: newAsset.id.toString(),
                        id: newAsset.id,
                        query: newAsset.title,
                    })
                }
                revalidatePath('/dashboard/assets')
                return {success: 'Your Gallery and tags updated.'}
            }else{
                await dbPool.transaction(async (tx) => {
                    await tx.insert(assetImages).values(
                        images.map((image, imgIndex) => ({
                            name: image.name,
                            size: image.size,
                            url: image.url,
                            order: imgIndex,
                            assetId
                        }))
                    )
                    await tx.insert(assetTags).values(
                        tags.map(tag => ({
                            tag,
                            assetId
                        }))
                    )
                })
                const newAsset = await db.query.assets.findFirst({
                    where: eq(assets.id, assetId)
                })
                if(newAsset){
                    algoliaIndex.saveObject({
                        objectID: newAsset.id.toString(),
                        id: newAsset.id,
                        title: newAsset.title,
                        description: newAsset.description,
                        price: newAsset.price,
                        type: newAsset.type
                    })
                    algoliaQuerySuggest.saveObject({
                        objectID: newAsset.id.toString(),
                        id: newAsset.id,
                        query: newAsset.title,
                    })
                }
                revalidatePath('/dashboard/assets')
                return {success: 'Your Gallery and tags were created.'}
            }
        }catch(error){
            console.log(error)
            return {error: 'Something went wrong'}
        }
    })