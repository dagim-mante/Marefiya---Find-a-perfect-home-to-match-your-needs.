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
    let shortHand = ''
    if(rentType === 'month'){
      shortHand = 'Mo'
    }else if(rentType === 'week'){
      shortHand = 'Wk'
    }else if(rentType === 'night'){
      shortHand = 'Ni'
    }
    return `${formattedPrice}/${shortHand}`
  }
  return formattedPrice
}

export function getAverageReview(reviews: number[]){
  if(!reviews.length) return 0
  return reviews.reduce((acc, review) => acc + review, 0) / reviews.length
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort()
  return `${sortedIds[0]}--${sortedIds[1]}`
}