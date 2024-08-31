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
import { Button } from "../ui/button"
import { useAction } from "next-safe-action/hooks"
import { createFavourite } from "@/server/actions/add-favourite"
import { toast } from "sonner"
import * as z from "zod"
import { favouriteSchema } from "@/types/favourite-schema"
import { Session } from "next-auth"
import { removedFavourite } from "@/server/actions/remove-favourite"
import { useAssetsStore } from "@/lib/useAssetsStore"
import { useMemo } from "react"

export default function Assets({
    assets,
    session
}: {
    assets:AssetWithImagesAndTags[],
    session: Session | null
}){

    const {assets: storedAssets, toFilterAssetsIds, setAssets} = useAssetsStore()

    // useMemo(() => {
    //     setAssets(assets)
    // }, [])

    const {status, execute} = useAction(createFavourite, {
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
            toast.loading('Adding to favourites...')
        },
        onSettled: () => {
            toast.dismiss()
        }
    })

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



    const addToFavourite = (assetIdx: number, userIdx: string) => {
        execute({
            userId: userIdx,
            assetId: assetIdx
        })
    }
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
                            ${asset.assetImages.map(assetImage => (
                                <CarouselItem key={assetImage.id}>
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
                    {session ? (
                        <div>
                            {isInmyFavourite(asset.favourites, session.user.id) ? (
                                <div>
                                    <p>Your Favourite</p>
                                    <Button
                                    disabled={removeStatus === 'executing'}
                                    onClick={() => {
                                        removeFromFavourites(
                                            isInmyFavourite(asset.favourites, session.user.id)!,
                                            asset.id,
                                            session.user.id
                                        )
                                    }}
                                    >Remove from favourites</Button>
                                </div>
                            ): (
                                <Button
                                disabled={status === 'executing'}
                                onClick={() => {
                                    addToFavourite(asset.id,  session.user.id)
                                }}
                                >Add to favourites</Button>
                            )}
                        </div>
                    ) : null}
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