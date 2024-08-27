import ReviewsForm from "./review-form";

export default async function Reviews({assetId}: {assetId: number}){
    return (
        <section className="py-8">
            <div>
                <h2 className="text-2xl">Asset Reviews</h2>
            </div>
            <ReviewsForm assetId={assetId}/>
        </section>
    )
}