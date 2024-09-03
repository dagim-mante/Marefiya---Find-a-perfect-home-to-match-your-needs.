import { db } from "@/server";
import ReviewsForm from "./review-form";
import { reviews } from "@/server/schema";
import { desc, eq } from "drizzle-orm";
import Review from "./review";
import ReviewsChart from "./reviews-chart";

export default async function Reviews({assetId}: {assetId: number}){
    const data = await db.query.reviews.findMany({
        where: eq(reviews.assetId, assetId),
        with: {
            user: true
        },
        orderBy: [desc(reviews.created)]
    })
    return (
        <section className="py-4">
            <div className="flex gap-2 lg:gap-12 justify-stretch lg:flex-row flex-col">
                <div className="flex-1">
                    <ReviewsForm assetId={assetId}/>
                    <Review reviews={data} />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <ReviewsChart reviews={data} />
                </div>
            </div>
        </section>
    )
}