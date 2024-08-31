'use client'

import { searchClient } from "@/lib/algolia-client"
import { InstantSearchNext } from "react-instantsearch-nextjs"

export default function InstantSearchProvider({
    children
}:{
    children: React.ReactNode
}){
    return (
        <InstantSearchNext
            future={{
                persistHierarchicalRootCount: true,
                preserveSharedStateOnUnmount: true,
            }}
            searchClient={searchClient}
            indexName='assets'
        >
            {children}
        </InstantSearchNext>
    )
}