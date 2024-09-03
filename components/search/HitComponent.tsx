import Image from 'next/image';
import Link from 'next/link';
import { Highlight } from 'react-instantsearch'

import { formatPrice } from '@/lib/utils'

import type { Hit } from 'instantsearch.js';
import { Heart, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';
type ProductItem = {
    query: string,
    id: number,
    description: string,
    price: number,
    type: string,
    rentType: string | null,
    image: string
}

type HitComponentProps = {
  hit: Hit<ProductItem>;
};

export function HitComponent({ hit }: HitComponentProps) {
  return (
    <div className="rounded overflow-hidden shadow-lg flex flex-col">
        <div className="relative h-64">
            <Image width="96" height="95" className="w-full h-full"
                src={hit.image}
                alt={hit.query} />
            <div
                className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
            </div>
            <span>
                <Heart className="text-xs absolute top-0 right-0 bg-transparent p-0 cursor-pointer text-transparent mt-3 mr-3 fill-red-500 transition duration-300 ease-in-out" />
            </span>
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
            <div className="flex items-center justify-between">
                <Badge>
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
                <span className="ml-1">Akaki Kality, Addis Ababa</span>
            </span>
            <div></div>
        </div>
    </div>
  );
}