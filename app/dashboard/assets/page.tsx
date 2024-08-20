import { db } from "@/server"
import placeholder from "@/public/placeholder_small.jpg"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function Assets(){
    const assets = await db.query.assets.findMany({
        orderBy: (assets, {desc}) => [desc(assets.id)]
    })
    if(!assets) throw new Error("No assets found.")
    const dataTable = assets.map(asset => {
        return {
            id: asset.id,
            title: asset.title,
            type: asset.type as string,
            price: asset.price,
            image: placeholder.src
        } 
    })
    return (
        <div>
            <DataTable data={dataTable} columns={columns} />
        </div>
    )
}