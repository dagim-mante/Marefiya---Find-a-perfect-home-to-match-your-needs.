import { db } from "@/server"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { assets as assetsSchema } from "@/server/schema"
import { eq } from "drizzle-orm"
import placeholder from '@/public/logo-dark.png'

export default async function Assets(){
    const session = await auth()
    
    if(!session){
        return redirect('/auth/login')
    }
    if(session.user.role !== 'owner'){
        return redirect('/dashboard/settings')
    }
    const assets = await db.query.assets.findMany({
        with: {
            assetImages: true, assetTags: true
        },
        where: eq(assetsSchema.owner, session.user.id),
        orderBy: (assets, {desc}) => [desc(assets.id)],
    })
    if(!assets) throw new Error("No assets found.")
    const dataTable = assets.map(asset => {
        return {
            id: asset.id,
            title: asset.title,
            type: asset.type as string,
            rentType: asset.rentType as string | null,
            price: asset.price,
            imageGalleryAndTags: asset
        } 
    })
    
    return (
        <div>
            <DataTable data={dataTable} columns={columns} />
        </div>
    )
}