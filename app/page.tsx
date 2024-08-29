import Assets from "@/components/assets/assets";
import ReviewsForm from "@/components/reviews/review-form";
import { db } from "@/server";
import { auth } from "@/server/auth";

export default async function Home() {
  const data = await db.query.assets.findMany({
    with: {
      assetImages: true,
      assetTags: true,
      favourites: true
    },
    orderBy: (assets, {desc}) => [desc(assets.id)]
  })
  const session = await auth()

  return (
      <Assets assets={data} session={session} />
  );
}
