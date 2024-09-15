'use client'

import { Badge } from "@/components/ui/badge"
import { AssetWithImagesAndTags, OwnerProfile } from "@/lib/infer-type"
import { chatHrefConstructor, formatPrice } from "@/lib/utils"
import { Heart, MapPin, MessageCircle } from "lucide-react"
import { Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { useAction } from "next-safe-action/hooks"
import { createFavourite } from "@/server/actions/add-favourite"
import { toast } from "sonner"
import * as z from "zod"
import { favouriteSchema } from "@/types/favourite-schema"
import { removedFavourite } from "@/server/actions/remove-favourite"
import { useRouter } from "next/navigation"

export default function ProfilePage({
    profile,
    session,
    assets,
    id
}: {
    id: string 
    profile: OwnerProfile,
    session?: Session,
    assets: AssetWithImagesAndTags[]
}){

    const router = useRouter()

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
        <main className="max-w-screen-xl mx-auto sm:p-4 md:p-8">
            <section className="relative pt-40 pb-24">
                <Image 
                    width={1024}
                    height={500}
                    src="https://utfs.io/f/926d9623-a509-4d0f-bde5-ea64c4036935-n3ch5g.png"
                    alt="cover-image"
                    className="w-full absolute top-0 left-0 z-0 h-60"
                />
                <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
                    <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
                            <Image 
                                src={profile.image!}
                                width={150}
                                height={200}
                                alt="user-avatar-image"
                                 className="border-4 border-solid border-white dark:border-gray-700 rounded-full"
                            />
                    </div>
                    <div className="flex items-center justify-center flex-col sm:flex-row max-sm:gap-5 sm:justify-between mb-5">
                        <div className="block">
                            <h3 className="font-manrope font-bold text-4xl text-gray-900 dark:text-gray-300 mb-1 max-sm:text-center">{profile.name}</h3>
                            <p className="font-normal text-base leading-7 text-gray-500  max-sm:text-center w-4/5">{profile.bio ? profile.bio : 'My Bio...'}</p>
                        </div>
                        {(session && id !== session.user.id)? (
                            <button
                                onClick={() => {
                                    router.push(`/chat/${chatHrefConstructor(id, session.user.id)}`)
                                }}
                                className="py-3.5 px-5 flex rounded-full bg-primary hover:bg-primary/75 shadow-sm shadow-transparent transition-all duration-300 w-full items-center justify-center lg:self-start max-w-60">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M11.3011 8.69881L8.17808 11.8219M8.62402 12.5906L8.79264 12.8819C10.3882 15.6378 11.1859 17.0157 12.2575 16.9066C13.3291 16.7974 13.8326 15.2869 14.8397 12.2658L16.2842 7.93214C17.2041 5.17249 17.6641 3.79266 16.9357 3.0643C16.2073 2.33594 14.8275 2.79588 12.0679 3.71577L7.73416 5.16033C4.71311 6.16735 3.20259 6.67086 3.09342 7.74246C2.98425 8.81406 4.36221 9.61183 7.11813 11.2074L7.40938 11.376C7.79182 11.5974 7.98303 11.7081 8.13747 11.8625C8.29191 12.017 8.40261 12.2082 8.62402 12.5906Z"
                                        stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                                <span className="px-2 font-semibold text-base leading-7 text-white">Send Message</span>
                            </button>
                        ) : null}
                    </div>
                    <div>
                        <h2 className="mt-10 mb-4 text-2xl text-gray-900 dark:text-gray-200 font-bold">Assets({assets.length})</h2>
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
                                                <span className="ml-1">Akaki Kality, Addis Ababa</span>
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
                    </div>
                </div>
            </section>                                 
        </main>
    )
}