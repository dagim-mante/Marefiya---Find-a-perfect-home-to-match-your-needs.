import { db } from "@/server"
import { auth } from "@/server/auth"
import { assets, users } from "@/server/schema"
import { and, eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import ProfilePage from "./profile-page"

export default async function Profile({ 
    params: {id}
}:{
    params: {id: string}
}){
    if(!id){
        return redirect('/')
    }

    const profile = await db.query.users.findFirst({
        where: and(
            eq(users.id, id),
            eq(users.role, 'owner')
        ),
    })
    if(!profile){
        return (
            <h2>Profile not found</h2>
        )
    }

    let data = await db.query.assets.findMany({
        where: eq(assets.owner, profile.id),
        with: {
            assetImages: true,
            favourites: true,
            reviews: true,
            assetTags: true
        }
    })
    data = data.filter(asset => asset.assetImages.length > 0)

    const session = await auth()

    return (
        <ProfilePage id={id} profile={profile} assets={data} session={session!} />
    )
}