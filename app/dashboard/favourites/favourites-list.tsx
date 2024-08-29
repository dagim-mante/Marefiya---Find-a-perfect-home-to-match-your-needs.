'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { FavouritesWithAsset } from "@/lib/infer-type";
import { formatPrice } from "@/lib/utils";
import { removedFavourite } from "@/server/actions/remove-favourite";
import { favouriteSchema } from "@/types/favourite-schema";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import * as z from "zod"

export default function FavouritesList({
    assets,
    session
}: {
    assets: FavouritesWithAsset[],
    session: Session
}){
    const {status: removeStatus, execute: removeExecute} = useAction(removedFavourite, {
        onSuccess: ({data}) => {
            if(data?.error){
                toast.error(data.error)
            }
            if(data?.success){
                toast.success(data.success)
            }
        },
        onError: () => {
            toast.error('Something went wrong')
        },
        onExecute: () => {
            toast.loading('Removing from favourites...')
        },
        onSettled: () => {
            toast.dismiss()
        }
    })

    const removeFromFavourites = (favoriteIdx: number, assetIdx: number, userIdx: string) => {
        removeExecute({
            id: favoriteIdx,
            userId: userIdx,
            assetId: assetIdx
        })
    }

    const isInmyFavourite = (favourites: z.infer<typeof favouriteSchema>[], userId: string) => {
        return favourites.find(f => f.userId === userId)?.id
    }

    return (
        <main className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {assets.map(asset => (
                <div
                    key={asset.id}
                    className="flex flex-col rounded-md h-full bg-red-300"
                >
                    <Carousel className="h-4/5">
                        <CarouselContent>
                            ${asset.asset.assetImages.map(assetImage => (
                                <CarouselItem key={assetImage.id}>
                                    <Image 
                                        src={assetImage.url}
                                        alt={asset.asset.title}
                                        height={450}
                                        width={600}
                                        className="h-full rounded-md"
                                        loading='lazy'
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <Button
                        disabled={removeStatus === 'executing'}
                        onClick={() => {
                            removeFromFavourites(
                                isInmyFavourite(asset.asset.favourites, session?.user.id)!,
                                asset.asset.id,
                                session.user.id!
                            )
                        }}
                    >
                        Remove from favourites
                    </Button>
                    <Link  href={`/assets/${asset.asset.id}`} className="py-4">
                        <div className="flex items-center justify-between py-2">
                            <div className="text-xs">
                                <h2 className="font-bold">{asset.asset.title}</h2>
                                <p className="text-muted">For {`${asset.asset.type?.slice(0,1).toUpperCase()}${asset.asset.type?.slice(1)}`}</p>
                            </div>
                            <div>
                                <Badge variant={'secondary'}>
                                    <p className="font-medium text-xs" >
                                        {formatPrice(asset.asset.price, asset.asset.type, asset.asset.rentType)}    
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