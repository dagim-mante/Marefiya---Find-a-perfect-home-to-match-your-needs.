import Assets from "@/components/assets/assets";
import HeroSection from "@/components/home/hero-section";
import { db } from "@/server";
import { auth } from "@/server/auth";

export const revalidate = 60

export default async function Home() {
  let data = await db.query.assets.findMany({
    with: {
      assetImages: true,
      assetTags: true,
      favourites: true,
      reviews: true
    },
    orderBy: (assets, {desc}) => [desc(assets.id)],
    limit: 12
  })
  data = data.filter(asset => asset.assetImages.length > 0)
  const session = await auth()

  return (
    <>
      <HeroSection />
      <Assets assets={data} session={session} />
    </>
  );
}
