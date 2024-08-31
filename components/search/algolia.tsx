'use client'
import { SearchBox, Hits, useHits } from "react-instantsearch"
import Link from 'next/link'
import { Card } from '../ui/card'
import {motion, AnimatePresence} from 'framer-motion'
import { FormEvent, useMemo, useState } from 'react'
import { Badge } from '../ui/badge'
import { cn, formatPrice } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import InstantSearchProvider from "./instant-search-provides"
import { useAssetsStore } from "@/lib/useAssetsStore"

export function Algolia(){
    const [active, setActive] = useState(false)
    const MCard = useMemo(() => motion(Card), [])
    const router = useRouter()
    const params = useSearchParams()

    const searchMode = params.get('search')

    return (
        <InstantSearchProvider>
            <div className="relative">
                <SearchBox
                    placeholder='Search for assets...'
                    onFocus={() => setActive(true)}
                    onBlur={() => {
                        setTimeout(() => {
                            setActive(false)
                        }, 200)
                    }}
                    submitIconComponent={({ classNames }) => (
                        <div className={cn(classNames.submitIcon, 'px-3 h-full py-1 flex items-center justify-center')}>
                            <Search size={15}/>
                        </div>
                    )}
                    loadingIconComponent={({ classNames }) => (
                        <div className={classNames.loadingIcon}>
                            <AnimatePresence>
                                <MCard
                                    animate={{ opacity: 1, scale: 1 }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="p-2 absolute w-full z-50 overflow-y-scroll max-h-96"
                                >
                                    <p className="font-medium ml-2 text-xs">Searching...</p>
                                </MCard>
                            </AnimatePresence>
                        </div>
                    )}
                    classNames={{
                        input: 'h-full w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        submitIcon: "absolute top-0 right-0",
                        form: "relative mb-4",
                        resetIcon: "hidden",
                    }}
                    onSubmit={(e: FormEvent) => {
                        console.log('submitted')
                        if(e.target[0].value !== ''){
                            router.push(`?search=${e.target[0].value}`)
                            return
                        }
                        router.push(`/`)
                    }}
                />
                {active && (
                    <AnimatePresence>
                        <MCard
                            animate={{ opacity: 1, scale: 1 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute w-full z-50 overflow-y-scroll max-h-96"
                        >
                            {!searchMode ? (
                                <Hits 
                                    hitComponent={Hit}
                                    className="rounded-md"
                                />
                            ) : (
                                <Hits 
                                    hitComponent={Hit}
                                    className="rounded-md"
                                />
                            )}
                        </MCard>
                    </AnimatePresence>
                )}
            </div>
        </InstantSearchProvider>
    )
}

function Hit({
    hit
}: {
    hit: {
        objectID: string,
        id: number,
        title: string,
        description: string,
        type: string,
        price: number,
        rentType: string | null,
        _highlightResult: {
            title: {
                value: string,
                matchLevel: string,
                fullyHighlighted: boolean,
                matchedWords: string[]
            },
            type: {
                value: string,
                matchLevel: string,
                fullyHighlighted: boolean,
                matchedWords: string[]
            },
            price: {
                value: number,
                matchLevel: string,
                fullyHighlighted: boolean,
                matchedWords: string[]
            }
        }
    } 
}){
    if(hit._highlightResult.title.matchLevel === 'none' && 
        hit._highlightResult.type.matchLevel === 'none' &&
        hit._highlightResult.price.matchLevel === 'none'
    ){
        return null
    }
    const formattedPrice = formatPrice(hit.price, hit.type, hit.rentType)
    return (
        <div className="p-2 mb-2 hover:bg-secondary ">
            <Link href={`/assets/${hit.id}`}>
                <div className="flex items-center justify-strech">
                    <p
                    className='font-medium ml-2 text-xs'
                    dangerouslySetInnerHTML={{
                    __html: hit._highlightResult.title.value,
                    }}>
                    </p>
                    <Badge className='font-medium ml-2 text-xs'>
                        <p
                        dangerouslySetInnerHTML={{
                        __html: hit._highlightResult.type.value,
                        }}>
                        </p>
                    </Badge>
                    <p className='font-medium ml-2 text-xs'>
                        {formattedPrice}    
                    </p>
                </div>
            </Link>
        </div>
    )
}