import algoliasearch from 'algoliasearch/lite'

export const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH!
)