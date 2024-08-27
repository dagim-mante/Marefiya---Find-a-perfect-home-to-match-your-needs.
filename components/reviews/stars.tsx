import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

export default function Stars({
    rating,
    totalReviews,
    size = 14
}: {
    rating: number,
    totalReviews?: number,
    size?: number
}){
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star} 
                    size={size}
                    className={cn(
                        "text-primary bg-transparent transition-all duration-300 ease-in-out",
                        rating >= star ? "fill-primary" : "fill-transparent"
                    )}
                />
            ))}
            {totalReviews ?  (
                <span className="text-secondary-foreground font-bold text-sm ml-2">
                    {totalReviews} reviews
                </span>
            ) : null}
        </div>
    )
}