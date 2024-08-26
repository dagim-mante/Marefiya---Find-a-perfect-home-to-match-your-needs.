import AssetShowcase from "@/components/assets/asset-showcase"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { db } from "@/server"
import { assets } from "@/server/schema"
import { eq } from "drizzle-orm"

export default async function AssetDetails({
    params: {id}
}: {
    params: {id: string}
}){
    const asset = await db.query.assets.findFirst({
        where: eq(assets.id, Number(id)),
        with: {
            assetImages: true,
            assetTags: true
        }
    }) 
    if(asset){
        return (
            <main>
                <section className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                    <div className="flex-1">
                        <AssetShowcase images={asset.assetImages} />
                    </div>
                    <div className="flex flex-col flex-1">
                        <h2 className="font-bold text-2xl">{asset.title}</h2>
                        <h4>For {`${asset.type?.slice(0, 1).toUpperCase()}${asset.type?.slice(1)}`}</h4>
                        <Separator className="my-2"/>
                        <p className="font-medium py-2">
                            {formatPrice(asset.price, asset.type, asset.rentType)}
                        </p>
                        <div
                            className="text-small"
                            dangerouslySetInnerHTML={{ __html: asset.description }}
                        ></div>
                    </div>
                </section>
            </main>
        )
    }
    return (
        <h2>Product not found!</h2>
    )
}