'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Autocomplete } from "../search/AutoComplete"
import { useLazyRef } from "@/lib/useLazyRef"
import {searchClient} from "@/lib/search-client"
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions'
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches'
import { AutocompleteItem, AutocompleteItemAction } from "../search/AutoCompleteItem"
import {
    ClockIcon,
    Bars3Icon,
    ShoppingBagIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    ArrowUpLeftIcon,
    TrashIcon,
  } from '@heroicons/react/24/outline';

export default function HeroSection(){
    const router = useRouter()
    const params = useSearchParams()

    const getQuerySuggestionsPlugin = useLazyRef(() => 
        createQuerySuggestionsPlugin({
            searchClient,
            indexName: 'assets_query_suggestions',
            transformSource({source, onTapAhead}){
                return {
                    ...source,
                    getItemUrl({item}){
                        return `/search?query=${item.query}`
                    },
                    templates: {
                        ...source.templates,
                        item({item, components}){
                            console.log('HERE', item)
                            return (
                                <AutocompleteItem
                                    router={router}
                                    href={`/search/?query=${item.query}`}
                                    icon={MagnifyingGlassIcon}
                                    actions={
                                        <AutocompleteItemAction
                                          icon={ArrowUpLeftIcon}
                                          title={`Fill query with "${item.query}"`}
                                          onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                    
                                            onTapAhead(item);
                                          }}
                                        />
                                    }
                                >
                                    <components.ReverseHighlight hit={item} attribute="query" />
                                </AutocompleteItem>
                            )
                        }
                    }
                }
            }
        })
    )

    const getRecentSearchesPlugin = useLazyRef(() =>
      createLocalStorageRecentSearchesPlugin({
        key: 'RECENT_SEARCH',
        limit: 5,
        transformSource({ source, onTapAhead, onRemove }) {
          return {
            ...source,
            templates: {
              item({ item, components }) {
                return (
                  <AutocompleteItem
                    router={router}
                    href={`/search/?query=${item.label}`}
                    icon={ClockIcon}
                    actions={
                      <>
                        <AutocompleteItemAction
                          icon={TrashIcon}
                          title="Remove this search"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
  
                            onRemove(item.label);
                          }}
                        />
                        <AutocompleteItemAction
                          icon={ArrowUpLeftIcon}
                          title={`Fill query with "${item.label}"`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
  
                            onTapAhead(item);
                          }}
                        />
                      </>
                    }
                  >
                    <components.ReverseHighlight hit={item} attribute="label" />
                  </AutocompleteItem>
                );
              },
            },
          };
        },
      })
    );

    return (
        <div className="w-full">
            <Autocomplete
                initialState={{
                    query: (params.get('query') as string) || '',
                }}
                openOnFocus={true}
                placeholder="Search for assets..."
                detachedMediaQuery="(max-width: 24px)"
                classNames={{
                  form: 'relative rounded-md shadow-sm flex-1',
                  inputWrapperPrefix:
                    'absolute inset-y-0 left-0 flex items-center pl-3',
                  inputWrapperSuffix:
                    'absolute inset-y-0 right-0 flex items-center pr-2',
                  submitButton: 'h-5 w-5 text-gray-400',
                  clearButton: 'h-5 w-5 text-gray-400',
                  input:
                    'block w-full rounded-md border-primary py-3 pl-10 sm:text-sm',
                  panel:
                    'absolute mt-2 lg:py-1 z-10 ring-1 ring-black ring-opacity-5 text-sm text-gray-500 bg-white lg:shadow-lg rounded-md overflow-y-scroll lg:max-h-96 md:text-md lg:text-md text-xs',
                }}
                navigator={{
                    navigate({itemUrl}){
                        router.push(itemUrl)
                    }
                }}
                onSubmit={({state}) => {
                    router.push(`/search?query=${state.query}`)
                }}
                plugins={[
                    getQuerySuggestionsPlugin(),
                    getRecentSearchesPlugin()
                ]}

            />
        </div>
    )
}