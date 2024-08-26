import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatPrice(price: number, type: string | null, rentType:string | null){
  const formattedPrice =  new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'ETB'
  }).format(price)
  if(type === 'rent'){
    return `${formattedPrice}/${rentType?.slice(0,1).toUpperCase()}${rentType?.slice(1)}`
  }
  return formattedPrice
}