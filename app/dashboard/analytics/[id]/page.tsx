import { db } from "@/server"
import { auth } from "@/server/auth"
import { assets } from "@/server/schema"
import { and, desc, eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import GraphAnalytics from "./graph-analytics"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DetailAnalytics({
    params: {id}
}: {
    params: {id: number}
}){
    const session = await auth()
    
    if(!session){
        return redirect('/auth/login')
    }
    if(session.user.role !== 'owner'){
        return redirect('/dashboard/settings')
    }
    const data = await db.query.assets.findFirst({
        orderBy: [desc(assets.created)],
        where: and(
            eq(assets.id, id),
            eq(assets.owner, session.user.id),
        ),
        with: {
            favourites: true,
            views: true,
            assetImages: true
        }
    })
    return (   
        <>
            {!data ? (
                <div>
                    <h2 className='font-medium text-2xl'>Asset not found.</h2>
                    <Button asChild>
                        <Link href={'/dashboard/analytics'}>Back to analytics</Link>
                    </Button>
                </div>
            ) : 
            <GraphAnalytics data={data!} />
            }
        </>
    )
}