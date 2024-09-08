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
      <div className="bg-gray-200 dark:bg-gray-800 rounded-md">
        <div className="dark:bg-transparent">
          <div className="mx-auto flex flex-col items-center py-12 sm:py-24">
              <div className="w-11/12 sm:w-2/3 lg:flex justify-center items-center flex-col mb-3 sm:mb-10">
                  <h1
                      className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl text-center text-gray-800 dark:text-white font-black leading-10">
                      Welcome to 
                      <span className="text-violet-800 dark:text-violet-500"> Marefiya</span>.
                  </h1>
                  <p className="sm:mt-5 lg:w-10/12 text-gray-600 dark:text-gray-300 font-normal text-center text-xl">
                      Lets find you a home. 
                  </p>
              </div>
              <div className="flex w-11/12 md:w-8/12 xl:w-6/12">
                  <div className="flex rounded-md w-full">
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
                                'dark:bg-gray-600 dark:text-white dark:hover:text-gray-500 absolute mt-2 lg:py-1 z-10 ring-1 ring-black ring-opacity-5 text-sm text-gray-500 bg-white lg:shadow-lg rounded-md overflow-y-scroll lg:max-h-96 md:text-md lg:text-md text-xs',
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
                  </div>
              </div>
          </div>
        </div>
      </div>
    )
}