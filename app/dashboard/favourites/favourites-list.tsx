'use client'

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FavouritesWithAsset } from "@/lib/infer-type";
import { formatPrice } from "@/lib/utils";
import { removedFavourite } from "@/server/actions/remove-favourite";
import { favouriteSchema } from "@/types/favourite-schema";
import { Heart, MapPin, MessageCircle } from "lucide-react";
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
       <Card>
            <CardHeader>
                <CardTitle>Your Favourites</CardTitle>
                <CardDescription>Here are your favourite assets.</CardDescription>
            </CardHeader>
            <CardContent>
                <main className="max-w-screen-xl mx-auto p-4 sm:p-4 md:p-8">
                {assets.length !== 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {assets.map(asset => (
                            <div key={asset.id} className="rounded overflow-hidden shadow-lg flex flex-col">
                                <div className="relative h-64">
                                        <Image width="96" height="95" className="w-full h-full"
                                            src={asset.asset.assetImages[0].url}
                                            alt={asset.asset.title} />
                                        <div
                                            className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                                        </div>
                                    {session ? (
                                        <>
                                            {isInmyFavourite(asset.asset.favourites, session.user.id) ? (
                                                <span
                                                    onClick={() => {
                                                        removeFromFavourites(
                                                            isInmyFavourite(asset.asset.favourites, session.user.id)!,
                                                            asset.id,
                                                            session.user.id
                                                        )
                                                    }}
                                                >
                                                    <Heart className="text-xs absolute top-0 right-0 bg-transparent p-0 cursor-pointer text-transparent mt-3 mr-3 fill-red-500 transition duration-300 ease-in-out" />
                                                </span>
                                            ): null}
                                        </>
                                    ): null}
                                </div>
                                <div className="px-6 py-3">
                                    <Link 
                                        href={`/assets/${asset.assetId}`}
                                        className="font-medium text-lg inline-block hover:text-primary transition duration-200 ease-in-out mb-2"
                                    >
                                        {asset.asset.title}
                                    </Link>
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                                        <Badge className="w-fit">
                                            {`For ${asset.asset.type?.slice(0, 1).toUpperCase()}${asset.asset.type?.slice(1)}`}
                                        </Badge>
                                        <p className="font-bold text-xs">
                                            {formatPrice(asset.asset.price, asset.asset.type, asset.asset.rentType)}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 lg:py-3 py-1 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1">
                                    <span className="py-1 text-xs font-regular dark:text-muted-foreground text-gray-900 mr-1 flex flex-row items-center">
                                        <MapPin />
                                        <span className="ml-1">{asset.asset.location}</span>
                                    </span>

                                    <span className="py-1 text-xs font-regular dark:text-muted-foreground text-gray-900 mr-1 flex flex-row items-center">
                                        <MessageCircle />
                                        <span className="ml-1">{asset.asset.reviews.length} Reviews</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h2>No Assets.</h2>
                )}
                </main>
            </CardContent>
       </Card> 
    )
}