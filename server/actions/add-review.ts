'use server'
import { ReviewsFormSchema } from "@/types/reviews-schema"
import {createSafeActionClient} from "next-safe-action"
import { auth } from "../auth"
import { db } from ".."
import { reviews } from "../schema"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()
export const addReview = action
    .schema(ReviewsFormSchema)
    .action(async ({parsedInput : {comment, rating, assetId}}) => {
        const session = await auth()
        if(!session)return {error: 'Please signin to leave review.'}
        try{
            const newReview = await db.insert(reviews).values({
                comment,
                rating,
                assetId,
                userId: session.user.id
            })
            revalidatePath(`/assets/${assetId}`)
            return {success: 'Added review successfully.'}
        }catch(err){
            return {error: 'Could not add review.'}
        }
    })