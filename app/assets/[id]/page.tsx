import AssetShowcase from "@/components/assets/asset-showcase"
import Reviews from "@/components/reviews/reviews"
import Stars from "@/components/reviews/stars"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice, getAverageReview } from "@/lib/utils"
import { db } from "@/server"
import { assets, users } from "@/server/schema"
import { eq } from "drizzle-orm"
import Image from "next/image"
import Link from "next/link"

export default async function AssetDetails({
    params: {id}
}: {
    params: {id: string}
}){
    const asset = await db.query.assets.findFirst({
        where: eq(assets.id, Number(id)),
        with: {
            assetImages: true,
            assetTags: true,
            reviews: true,
        }
    })
    if(asset){
        const owner = await db.query.users.findFirst({
            where: eq(users.id, asset.owner),
        })
        const reviewAvg = getAverageReview(asset.reviews.map(review => review.rating))
        return (
            <main>
                <div className="p-4 lg:max-w-7xl max-w-xl max-lg:mx-auto">
                    <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-3">
                        <div className="min-h-[300px] lg:col-span-3 rounded-lg w-full lg:sticky top-0 text-center lg:p-6">
                            <AssetShowcase images={asset.assetImages} />
                        </div>

                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold dark:text-gray-300 text-gray-800">{asset.title}</h2>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <p className="text-gray-800 dark:text-gray-200 text-xl font-bold">{formatPrice(asset.price, asset.type, asset.rentType)}</p>
                                <Badge>For {`${asset.type?.slice(0, 1).toUpperCase()}${asset.type?.slice(1)}`}</Badge>
                            </div>

                            <div className="flex space-x-2 mt-4">
                                <Stars 
                                    rating={reviewAvg}
                                    totalReviews={asset.reviews.length}
                                />
                            </div>
                            <Separator className="my-2"/>
                            {owner ? (
                                <Link href={`/profile/${owner?.id}`} className="hover:text-primary">
                                    <div className="flex items-start mt-4">
                                        <Image 
                                            alt="Owner"
                                            width={50}
                                            height={50}
                                            src={owner?.image!}
                                            className="w-12 h-12 rounded-full border-2 border-white" 
                                        />
                                        <div className="ml-3">
                                            <h4 className="text-sm font-bold">{owner?.name}</h4>
                                            <p className="text-xs mt-1">Recently Active.</p>
                                        </div>
                                    </div>
                                </Link>
                            ) : null}

                            <div className="mt-4">
                                <h3 className="text-xl font-bold dark:text-gray-300 text-gray-800">About the asset</h3>
                                <div
                                    className="text-small pl-4 mt-2 text-sm dark:text-gray-400 text-gray-800 overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: asset.description }}
                                ></div>
                            </div>               
                        </div>

                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl font-bold dark:text-gray-300 text-gray-900">Reviews({asset.reviews.length})</h3>
                    <Reviews assetId={asset.id} />
                </div>
            </main>
        )
    }
    return (
        <h2>Product not found!</h2>
    )
}