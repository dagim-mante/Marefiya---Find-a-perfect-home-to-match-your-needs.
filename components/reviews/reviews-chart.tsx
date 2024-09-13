'use client'

import { ReviewWithUser } from "@/lib/infer-type"
import { getAverageReview } from "@/lib/utils"
import { Card, CardDescription, CardTitle } from "../ui/card"
import { useEffect, useMemo } from "react"
import { Progress } from "../ui/progress"
import { Star } from "lucide-react"

export default function ReviewsChart({
    reviews
}: {
    reviews: ReviewWithUser[]
}){
    const averageReview = getAverageReview(reviews.map(r => r.rating))
    const getRatingByStars = useMemo(() => {
        const ratingValues = Array.from({length: 5}, () => 0)
        const totalReviews = reviews.length
        reviews.forEach(review => {
            const starIndex = review.rating - 1
            if(starIndex >= 0 && starIndex < 5){
                ratingValues[starIndex]++
            }
        })
        return ratingValues.map(rating => (rating / totalReviews) * 100).reverse()
    }, [reviews])

    return (
        <Card className="flex flex-col p-8 rounded-md gap-4">
            <div className="flex flex-col gap-2">
                <CardTitle>Asset Rating</CardTitle>
                <CardDescription className="text-lg font-medium">
                    {averageReview.toFixed(1)}/5 stars
                </CardDescription>
            </div>
            {getRatingByStars.map((rating, index) => (
                <div key={index} className="flex gap-2 justify-between items-center">
                    <p className="text-sm flex gap-1 font-bold">
                        {5 - index}.0 <Star size={14} className="mx-1" />
                    </p>
                    <Progress value={rating} />
                    <p className="text-sm flex gap-1 font-bold">
                        {rating ? rating.toFixed(1) : 0.0}%
                    </p>
                </div>
            ))}
        </Card>
    )
}
