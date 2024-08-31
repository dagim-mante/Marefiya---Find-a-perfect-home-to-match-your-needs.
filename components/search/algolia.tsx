'use client'
import {InstantSearchNext} from 'react-instantsearch-nextjs'
import { SearchBox, Hits } from "react-instantsearch"
import { searchClient } from '@/lib/algolia-client'
import Link from 'next/link'
import { Card } from '../ui/card'
import {motion, AnimatePresence} from 'framer-motion'
import { useMemo, useState } from 'react'
import { Badge } from '../ui/badge'
import { formatPrice } from '@/lib/utils'

export function Algolia(){
    const [active, setActive] = useState(false)
    const MCard = useMemo(() => motion(Card), [])
    return (
        <InstantSearchNext
            future={{
                persistHierarchicalRootCount: true,
                preserveSharedStateOnUnmount: true,
            }}
            searchClient={searchClient}
            indexName='assets'
        >
            <div className="relative">
                <SearchBox
                    onFocus={() => setActive(true)}
                    onBlur={() => {
                        setTimeout(() => {
                            setActive(false)
                        }, 200)
                    }}
                    classNames={{
                        input: 'h-full w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        submitIcon: "hidden",
                        form: "relative mb-4",
                        resetIcon: "hidden",
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
                            <Hits hitComponent={Hit} className="rounded-md" />
                        </MCard>
                    </AnimatePresence>
                )}
            </div>
        </InstantSearchNext>
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