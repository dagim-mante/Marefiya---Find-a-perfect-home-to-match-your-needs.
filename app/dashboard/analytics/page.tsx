import { db } from "@/server"
import { auth } from "@/server/auth"
import { assets } from "@/server/schema"
import { desc, eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import AssetAnalytics from "./asset-analytics"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Analytics(){
    const session = await auth()
    
    if(!session){
        return redirect('/auth/login')
    }
    if(session.user.role !== 'owner'){
        return redirect('/dashboard/settings')
    }
    const data = await db.query.assets.findMany({
        orderBy: [desc(assets.created)],
        where: eq(assets.owner, session.user.id),
        with: {
            favourites: true,
            views: true,
            assetImages: true
        }
    })

    return (
        <>
            {data?.length === 0 ? (
                <div>
                    <h2 className='font-medium text-2xl'>No Assets.</h2>
                    <Button asChild>
                        <Link href={'/dashboard/add-asset'}>Add asset</Link>
                    </Button>
                </div>
            ) : 
                <AssetAnalytics data={data} />
            }
        </>
    )
}