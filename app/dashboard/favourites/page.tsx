import { db } from "@/server";
import { auth } from "@/server/auth";
import { favourites } from "@/server/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import FavouritesList from "./favourites-list";


export default async function Favourites(){
    const session = await auth()
    if(!session) redirect('/auth/login')

    let assets = await db.query.favourites.findMany({
        where: eq(favourites.userId, session.user.id),
        with: {
            asset: {
                with: {
                    assetImages: true,
                    assetTags: true,
                    favourites: true,
                    reviews: true
                }
            }
        }
    })
    assets = assets.filter(asset => asset.asset.assetImages.length > 0)
  
    return (
        <FavouritesList assets={assets} session={session}/>
    )
}