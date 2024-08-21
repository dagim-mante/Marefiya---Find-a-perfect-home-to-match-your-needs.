'use server'

import { and, eq } from "drizzle-orm"
import { db } from ".."
import { assets } from "../schema"
import { auth } from "../auth"

export const getAsset = async ({id}: {id: number}) => {
    const session = await auth()
        if(!session || session?.user.role !== 'owner')return {error: 'You don\'t have access to this action.'}
    if(!id) return {error: "Asset not found."}
    try{
        const asset = await db.query.assets.findFirst({
            where: and(eq(assets.id, id), eq(assets.owner, session.user.id))
        })
        return {success: asset}
    }catch(err){
        return {error: 'Something went wrong.'}
    }
}