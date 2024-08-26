import Assets from "@/components/assets/assets";
import ReviewsForm from "@/components/reviews/review-form";
import { db } from "@/server";

export default async function Home() {
  const data = await db.query.assets.findMany({
    with: {
      assetImages: true,
      assetTags: true
    },
    orderBy: (assets, {desc}) => [desc(assets.id)]
  })
  return (
      <Assets assets={data}/>
  );
}
