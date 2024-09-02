import Assets from "@/components/assets/assets";
import HeroSection from "@/components/home/hero-section";
import { db } from "@/server";
import { auth } from "@/server/auth";

export default async function Home() {
  const data = await db.query.assets.findMany({
    with: {
      assetImages: true,
      assetTags: true,
      favourites: true,
      reviews: true
    },
    orderBy: (assets, {desc}) => [desc(assets.id)]
  })
  const session = await auth()

  return (
    <>
      <HeroSection />
      <Assets assets={data} session={session} />
    </>
  );
}
