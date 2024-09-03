'use client'

import {Configure, CurrentRefinements, InfiniteHits, InstantSearch, RangeInput, RefinementList, useCurrentRefinements, useSearchBox} from 'react-instantsearch'
import {searchClient} from '@/lib/search-client'
import { useRouter, useSearchParams } from "next/navigation"
import { Autocomplete } from "@/components/search/AutoComplete"
import { useLazyRef } from "@/lib/useLazyRef"

import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions'
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches'
import { AutocompleteItem, AutocompleteItemAction } from "@/components/search/AutoCompleteItem"
import {
    ClockIcon,
    MagnifyingGlassIcon,
    ArrowUpLeftIcon,
    TrashIcon,
    PlusIcon,
    XMarkIcon,
  } from '@heroicons/react/24/outline';
import { HitComponent } from '@/components/search/HitComponent'
import { singleIndex } from 'instantsearch.js/es/lib/stateMappings'
import { useState } from 'react'
import { Filter, FilterProps } from '@/components/search/Filters'
import { Dialog } from '@headlessui/react'

const FILTER_LABEL_MAP: Record<string, string> = {
  type: 'Type',
  rentType: 'Rent Type',
  price: 'Price',
};

export default function Search(){
    const router = useRouter()
    const params = useSearchParams()

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
      <main className="max-w-screen-xl mx-auto p-4 sm:p-4 md:p-8">
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
          <InstantSearch
              searchClient={searchClient}
              indexName='assets'
              key={(params.get('query') || '')}
              future={{
                persistHierarchicalRootCount: true,
                preserveSharedStateOnUnmount: true,
              }}
              routing={{
                stateMapping: singleIndex('assets'),
              }}
          >
              <VirtualSearchBox />
              <Dialog
                as="div"
                className="relative z-40 lg:hidden"
                open={mobileFiltersOpen}
                onClose={setMobileFiltersOpen}
                unmount={false}
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />

                <div className="fixed inset-0 flex z-40">
                  <Dialog.Panel className="ml-20 relative w-full h-full bg-white shadow-xl py-4 pb-6 flex flex-col overflow-y-auto">
                    <div className="px-4 flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                      <button
                        type="button"
                        className="-mr-2 w-10 h-10 p-2 flex items-center justify-center text-gray-400 hover:text-gray-500"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <Filters type="disclosure" />
                    </div>
                  </Dialog.Panel>
                </div>
              </Dialog>

              <div className="bg-gray-100 border-t border-gray-200">
          <div className="sm:flex sm:items-center mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="border-t border-gray-200 sm:border-0 flex-grow sm:flex sm:items-center">
              <h3 className="text-sm px-7 py-5 sm:p-0 flex-shrink-0 font-medium text-gray-500">
                Active filters
              </h3>
              <div
                aria-hidden="true"
                className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
              />
              <NoFiltersLabel />
              <CurrentRefinements
                transformItems={(items) =>
                  items.map((item) => {
                    return {
                      ...item,
                      label: FILTER_LABEL_MAP[item.label] || item.label,
                    };
                  })
                }
                classNames={{
                  root: 'relative before:content-[""] before:absolute before:w-6 before:h-full before:bg-gradient-to-r before:from-gray-100 after:content-[""] after:absolute after:w-6 after:h-full after:top-0 after:right-0 after:bg-gradient-to-l after:from-gray-100',
                  list: 'flex space-x-4 px-6 pb-4 sm:py-4 overflow-auto',
                  noRefinementList: '!p-0 sm:mt-0.5 sm:h-16',
                  item: 'flex flex-shrink-0 rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900',
                  categoryLabel: 'ml-2 font-normal text-gray-700',
                  delete:
                    'ml-1 inline-flex items-center w-4 h-4 flex-shrink-0 rounded-full p-1 hover:!bg-gray-200 text-xs text-gray-400 hover:text-gray-500',
                }}
              />
            </div>
          </div>
        </div>

              <div className="mx-w-2xl mx-auto px-4 lg:max-w-7xl lg:px-8">
                <div className="pt-12 pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                  <aside>
                    <h2 className="sr-only">Filters</h2>

                    <button
                      type="button"
                      className="inline-flex items-center lg:hidden"
                      onClick={() => setMobileFiltersOpen(true)}
                    >
                      <span className="text-sm font-medium text-gray-700">
                        Filters
                      </span>
                      <PlusIcon
                        className="flex-shrink-0 ml-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </button>

                    <div className="hidden lg:block divide-y divide-gray-200 space-y-10">
                      <Filters type="list" />
                    </div>
                  </aside>

                  <section
                    aria-labelledby="product-heading"
                    className="mt-6 lg:mt-0 lg:col-span-2 xl:col-span-3"
                  >
                    <h2 id="product-heading" className="sr-only">
                      Assets
                    </h2>
                    <InfiniteHits
                    hitComponent={HitComponent}
                    showPrevious={true}
                    classNames={{
                      list: 'grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3',
                      item: 'relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden',
                      loadPrevious:
                        'mb-10 h-10 w-full items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600',
                      disabledLoadPrevious: 'hidden',
                      loadMore:
                        'mt-10 h-10 w-full items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600',
                      disabledLoadMore: 'hidden',
                    }}
                  />
              </section>
            </div>
          </div>
        </InstantSearch>
      </main>
    )
}

function VirtualSearchBox() {
    useSearchBox();
    return null;
}

function Filters({ type }: Pick<FilterProps, 'type'>) {
  return (
    <>
      <Filter header="Type" type={type} className="pt-10">
        <RefinementList
          attribute="type"
          limit={8}
          classNames={{
            list: 'pt-6 space-y-4 lg:space-y-3',
            item: 'flex items-center',
            label: 'cursor-pointer',
            selectedItem: 'font-semibold',
            checkbox:
              'h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer',
            labelText: 'ml-3 text-sm text-gray-600',
            count:
              'ml-1.5 rounded bg-gray-200 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-gray-700',
          }}
        />
      </Filter>
      <Filter header="Rent Type" type={type} className="pt-10">
        <RefinementList
          attribute="rentType"
          limit={8}
          classNames={{
            list: 'pt-6 space-y-4 lg:space-y-3',
            item: 'flex items-center',
            label: 'cursor-pointer',
            selectedItem: 'font-semibold',
            checkbox:
              'h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer',
            labelText: 'ml-3 text-sm text-gray-600',
            count:
              'ml-1.5 rounded bg-gray-200 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-gray-700',
          }}
        />
      </Filter>
      <Filter header="Price range" type={type} className="pt-10">
        <RangeInput
          attribute="price"
          classNames={{
            form: 'pt-6 flex space-x-4 justify-between',
            input:
              'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
            separator: 'self-center text-sm font-medium text-gray-500',
            submit:
              'rounded-md bg-gray-200 px-4 text-sm font-medium text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50',
          }}
        />
      </Filter>
    </>
  );
}

function NoFiltersLabel() {
  const { canRefine } = useCurrentRefinements();

  return (
    (!canRefine && (
      <p className="text-sm mx-7 mb-4 sm:mb-0 font-normal text-gray-400">
        No active filters
      </p>
    )) ||
    null
  );
}