'use client'

import { AssetWithImagesAndTags } from "@/lib/infer-type"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { formatPrice } from "@/lib/utils"

export default function Assets({
    assets
}: {
    assets:AssetWithImagesAndTags[]
}){
    return (
        <main className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {assets.map(asset => (
                <Link key={asset.id} href={`/assets/${asset.id}`} className="py-4">
                    <Image 
                        src={asset.assetImages[0].url}
                        alt={asset.title}
                        width={400}
                        height={400}
                        className="rounded-md"
                        loading='lazy'
                    />
                    <div className="flex justify-between py-2">
                        <div className="font-medium text-sm">
                            <h2>{asset.title}</h2>
                            <p>{asset.type}</p>
                        </div>
                        <div>
                            <Badge className="text-xs" variant={'secondary'}>
                                {formatPrice(asset.price, asset.type, asset.rentType)}    
                            </Badge>
                        </div>
                    </div>
                </Link>
            ))}
        </main>
    )
}