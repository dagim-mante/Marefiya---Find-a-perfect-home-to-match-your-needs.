'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Highlight } from 'react-instantsearch'

import { formatPrice } from '@/lib/utils'

import type { Hit, BaseHit} from 'instantsearch.js';
import { Heart, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge'
import { useAction } from 'next-safe-action/hooks'
import { createFavourite } from '@/server/actions/add-favourite'
import { toast } from 'sonner'
import { removedFavourite } from '@/server/actions/remove-favourite'
import { Session } from 'next-auth'

type ProductItem = {
    query: string,
    id: number,
    description: string,
    price: number,
    type: string,
    rentType: string | null,
    image: string
}

type FavouriteType = { 
    id: number;
    userId: string;
    assetId: number;
    created: Date | null; 
}

type HitComponentProps = {
  hit: Hit<BaseHit>,
  session?: Session,
  favourites?: FavouriteType[]
};

export function HitComponent({hit, session, favourites}:  HitComponentProps){
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


    const isInmyFavourite = ( favourites:FavouriteType[] | null, userId: string, assetId: number) => {
        if(!favourites){
            return null
        }
        for(let i = 0; i < favourites.length; i++){
            if(favourites[i].userId === userId && favourites[i].assetId === assetId){
                return {
                    exists: true,
                    favId: favourites[i].id
                }
            }
        }
        return {
            exists: false,
            favId: undefined
        }
    }

  return (
    <div className="rounded overflow-hidden shadow-lg flex flex-col">
        <div className="relative h-64">
            <Image width="96" height="95" className="w-full h-full"
                src={hit.image}
                alt={hit.query} />
            <div
                className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
            </div>
            {session ? (
                <>
                    {isInmyFavourite(favourites!, session.user.id, hit.id)?.exists ? (
                        <span
                            onClick={() => {
                                removeFromFavourites(
                                    isInmyFavourite(favourites!, session.user.id, hit.id)?.favId!,
                                    hit.id,
                                    session.user.id
                                )
                            }}
                        >
                            <Heart className="text-xs absolute top-0 right-0 bg-transparent p-0 cursor-pointer text-transparent mt-3 mr-3 fill-red-500 transition duration-300 ease-in-out" />
                        </span>
                    ) : (
                        <span
                            onClick={() => {
                                addToFavourite(hit.id,  session.user.id)
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
                href={`/assets/${hit.id}`}
                className="font-medium text-lg inline-block hover:text-primary transition duration-200 ease-in-out mb-2"
            >
                <Highlight
                    hit={hit}
                    attribute="query"
                    classNames={{
                        highlighted:
                        'bg-indigo-50 rounded-sm px-0.5 text-indigo-600 font-semibold',
                    }}
                />
            </Link>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                <Badge className="w-fit">
                    {`${hit.type?.slice(0, 1).toUpperCase()}${hit.type?.slice(1)}`}
                </Badge>
                <p className="font-bold text-xs">
                    {formatPrice(hit.price, hit.type, hit.rentType)}
                </p>
            </div>
        </div>
        <div className="px-6 py-3 flex flex-row items-center justify-between gap-1">
            <span className="py-1 text-xs font-regular dark:text-muted-foreground text-gray-900 mr-1 flex flex-row items-center">
                <MapPin />
                <span className="ml-1">{hit.location}</span>
            </span>
            <div></div>
        </div>
    </div>
  );
}