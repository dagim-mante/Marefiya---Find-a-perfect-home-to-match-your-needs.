import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading(){
    return (
        <main className="max-w-screen-xl mx-auto p-4 sm:p-4 md:p-8">
          <div className="w-full">
              <Skeleton className="w-full h-10" />
          </div>
          <div>
              <div className="dark:bg-secondary border-t border-white dark:border-gray-500 mt-2">
                <div className="sm:flex sm:items-center mx-auto sm:px-6 lg:px-8 max-w-7xl">
                  <div className="sm:border-0 flex-grow sm:flex sm:items-center">
                    <Skeleton className="w-20 h-10 flex-shrink-0 "/>
                    <div
                      aria-hidden="true"
                      className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
                    />
                  </div>
                </div>
              </div>

              <div className="mx-w-2xl mx-auto px-4 lg:max-w-7xl lg:px-8">
                <div className="pt-4 pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                  <aside>
                    <h2 className="sr-only">Filters</h2>
                    <Skeleton className="w-20 h-10 inline-flex items-center lg:hidden" />
                    <div className="hidden lg:block divide-y divide-gray-200 space-y-10">
                      <Skeleton className="w-full h-44" />
                      <div
                      aria-hidden="true"
                      className="h-[1px] w-full my-1 bg-gray-500 dark:bg-gray-300 sm:block"
                        />
                      <Skeleton className="w-full h-44" />
                      <div
                      aria-hidden="true"
                      className="h-[1px] w-full my-1 bg-gray-500 dark:bg-gray-300 sm:block"
                        />
                      <Skeleton className="w-full h-44" />
                    </div>
                  </aside>

                  <section
                    aria-labelledby="product-heading"
                    className="mt-6 lg:mt-0 lg:col-span-2 xl:col-span-3"
                  >
                    <h2 id="product-heading" className="sr-only">
                      Assets
                    </h2>
                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
                        {[1, 2, 3, 4 ,5 , 6, 7, 8, 9].map(num => (
                            <div key={num} className="rounded overflow-hidden shadow-lg flex flex-col">
                                <div className="relative h-72">
                                    <Skeleton className="w-full h-full" />
                                </div>
                            </div>
                        ))}
                    </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    )
}