'use client'

import { AssetWithImagesAndTags } from "@/lib/infer-type"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { formatPrice } from "@/lib/utils"
  
  

export default function Assets({
    assets
}: {
    assets:AssetWithImagesAndTags[]
}){
    return (
        <main className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {assets.map(asset => (
                <div
                    key={asset.id}
                    className="flex flex-col rounded-md h-full bg-red-300"
                >
                    <Carousel className="h-4/5">
                        <CarouselContent>
                            ${asset.assetImages.map(assetImage => (
                                <CarouselItem>
                                    <Image 
                                        src={assetImage.url}
                                        alt={asset.title}
                                        height={450}
                                        width={600}
                                        className="h-full rounded-md"
                                        loading='lazy'
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <Link  href={`/assets/${asset.id}`} className="py-4">
                        <div className="flex items-center justify-between py-2">
                            <div className="text-xs">
                                <h2 className="font-bold">{asset.title}</h2>
                                <p className="text-muted">For {`${asset.type?.slice(0,1).toUpperCase()}${asset.type?.slice(1)}`}</p>
                            </div>
                            <div>
                                <Badge variant={'secondary'}>
                                    <p className="font-medium text-xs" >
                                        {formatPrice(asset.price, asset.type, asset.rentType)}    
                                    </p>
                                </Badge>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </main>
    )
}