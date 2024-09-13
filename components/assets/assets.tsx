'use client'

import { AssetWithImagesAndTags } from "@/lib/infer-type"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { formatPrice } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { createFavourite } from "@/server/actions/add-favourite"
import { toast } from "sonner"
import * as z from "zod"
import { favouriteSchema } from "@/types/favourite-schema"
import { Session } from "next-auth"
import { removedFavourite } from "@/server/actions/remove-favourite"
import { Heart, MapPin, MessageCircle } from "lucide-react"

export default function Assets({
    assets,
    session
}: {
    assets:AssetWithImagesAndTags[],
    session: Session | null
}){

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
        <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mt-8">Discover</h2>
            <main className="max-w-screen-xl mx-auto p-4 sm:p-4 md:p-8">
                {assets ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {assets.map(asset => (
                            <div key={asset.id} className="rounded overflow-hidden shadow-lg flex flex-col">
                                <div className="relative h-64">
                                        <Image width="96" height="95" className="w-full h-full"
                                            src={asset.assetImages[0].url}
                                            alt={asset.title} />
                                        <div
                                            className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                                        </div>
                                    {session ? (
                                        <>
                                            {isInmyFavourite(asset.favourites, session.user.id) ? (
                                                <span
                                                    onClick={() => {
                                                        removeFromFavourites(
                                                            isInmyFavourite(asset.favourites, session.user.id)!,
                                                            asset.id,
                                                            session.user.id
                                                        )
                                                    }}
                                                >
                                                    <Heart className="text-xs absolute top-0 right-0 bg-transparent p-0 cursor-pointer text-transparent mt-3 mr-3 fill-red-500 transition duration-300 ease-in-out" />
                                                </span>
                                            ) : (
                                                <span
                                                    onClick={() => {
                                                        addToFavourite(asset.id,  session.user.id)
                                                    }}
                                                >
                                                    <Heart className="text-xs absolute top-0 right-0 bg-transparent p-0 cursor-pointer text-white mt-3 mr-3 hover:fill-red-500 hover:text-transparent transition duration-300 ease-in-out" />
                                                </span>
                                            )}
                                        </>
                                    ): null}
                                </div>
                                <div className="px-6 py-3">
                                    <Link 
                                        href={`/assets/${asset.id}`}
                                        className="font-medium text-lg inline-block hover:text-primary transition duration-200 ease-in-out mb-2"
                                    >
                                        {asset.title}
                                    </Link>
                                    <div className="flex items-center justify-between">
                                        <Badge>
                                            {`For ${asset.type?.slice(0, 1).toUpperCase()}${asset.type?.slice(1)}`}
                                        </Badge>
                                        <p className="font-bold text-xs">
                                            {formatPrice(asset.price, asset.type, asset.rentType)}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 py-3 flex flex-row items-center justify-between gap-1">
                                    <span className="py-1 text-xs font-regular dark:text-muted-foreground text-gray-900 mr-1 flex flex-row items-center">
                                        <MapPin />
                                        <span className="ml-1">{asset.location}</span>
                                    </span>

                                    <span className="py-1 text-xs font-regular dark:text-muted-foreground text-gray-900 mr-1 flex flex-row items-center">
                                        <MessageCircle />
                                        <span className="ml-1">{asset.reviews.length} Reviews</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h2>No Assets.</h2>
                )}
            </main>
        </>
    )
}