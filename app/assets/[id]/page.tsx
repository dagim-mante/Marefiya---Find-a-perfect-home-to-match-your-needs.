import AssetShowcase from "@/components/assets/asset-showcase"
import Reviews from "@/components/reviews/reviews"
import Stars from "@/components/reviews/stars"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { chatHrefConstructor, formatPrice, getAverageReview } from "@/lib/utils"
import { db } from "@/server"
import { auth } from "@/server/auth"
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
    const session = await auth()
    if(asset){
        const owner = await db.query.users.findFirst({
            where: eq(users.id, asset.owner),
        })
        const reviewAvg = getAverageReview(asset.reviews.map(review => review.rating))
        
        return (
            <main>
                <div className="p-4 lg:max-w-7xl max-w-xl max-lg:mx-auto">
                    <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-3">
                        <div className="max-h-[300px] sm:min-h-[300px] lg:col-span-3 rounded-lg w-full lg:sticky top-0 text-center lg:p-6">
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
                                <div className="flex flex-wrap items-center gap-3">
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
                                    <div>
                                        {(session && owner.id !== session?.user.id)? (
                                                <Button
                                                    asChild
                                                    className="py-2 px-3 flex rounded-md bg-primary hover:bg-primary/75 shadow-sm shadow-transparent transition-all duration-300 w-full items-center justify-center lg:self-start max-w-60"
                                                >
                                                    <Link href={`/chat/${chatHrefConstructor(owner.id, session.user.id)}`}>
                                                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M11.3011 8.69881L8.17808 11.8219M8.62402 12.5906L8.79264 12.8819C10.3882 15.6378 11.1859 17.0157 12.2575 16.9066C13.3291 16.7974 13.8326 15.2869 14.8397 12.2658L16.2842 7.93214C17.2041 5.17249 17.6641 3.79266 16.9357 3.0643C16.2073 2.33594 14.8275 2.79588 12.0679 3.71577L7.73416 5.16033C4.71311 6.16735 3.20259 6.67086 3.09342 7.74246C2.98425 8.81406 4.36221 9.61183 7.11813 11.2074L7.40938 11.376C7.79182 11.5974 7.98303 11.7081 8.13747 11.8625C8.29191 12.017 8.40261 12.2082 8.62402 12.5906Z"
                                                                stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                                                        </svg>
                                                        <span className="px-1 font-semibold text-sm text-white">Send Message</span>
                                                    </Link>
                                                </Button>
                                        ) : null}
                                    </div>
                                </div>
                            ) : null}

                            <div className="mt-4">
                                <h3 className="text-xl font-bold dark:text-gray-300 text-gray-800">About the asset</h3>
                                <div
                                    className="text-wrap text-small pl-4 mt-2 text-sm dark:text-gray-400 text-gray-800 overflow-hidden"
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