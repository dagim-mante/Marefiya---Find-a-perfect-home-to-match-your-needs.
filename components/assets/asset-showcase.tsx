'use client'
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react"

type ImageType = {
    id: number;
    name: string;
    url: string;
    size: number;
    order: number;
    assetId: number
}

export default function AssetShowcase({
    images
}: {
    images: ImageType[]
}){
    if(!images) return null
    const [api, setApi] = useState<CarouselApi>()
    const [activeThumbnail, setActiveThumbnail] = useState([0])

    useEffect(() => {
        if(!api) return
        api.on('slidesInView', (e) => {
            setActiveThumbnail(e.slidesInView())
        })
    }, [api])

    useEffect(() => {
        fetch(`/api/update-views`, {
            method: 'POST',
            headers: {
                'Content-Type': 'applcation/json'
            },
            body: JSON.stringify({assetId: images[0].assetId})
        })
            .then(response => response.json())
            .then(res => {
                console.log(res)
            }).catch(err => console.log(err ))

    }, [images[0].assetId])

    const updatePreview = (index:number) => {
        api?.scrollTo(index)
    }
    return (
        <Carousel setApi={setApi} opts={{loop: true}}>
            <CarouselContent>
                {images.map(img => (
                    <CarouselItem key={img.url}>    
                        <Image 
                            src={img.url}
                            alt={img.name}
                            width={780}
                            height={720}
                            priority
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="flex gap-4 my-2 overflow-clip">
                {images.map((img, index)=> (
                    <div key={img.url}>    
                        <Image
                            className={cn(index === activeThumbnail[0] ? 'opacity-100': 'opacity-50',
                                'rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75'
                            )}
                            onClick={() => updatePreview(index)}
                            src={img.url}
                            alt={img.name}
                            width={78}
                            height={72}
                            priority
                        />
                    </div>
                ))}
            </div>
        </Carousel>
    )  
}