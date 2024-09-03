import { auth } from "@/server/auth";
import SearchFilters from "./search-filters";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { favourites } from "@/server/schema";


export default async function Search(){
    const session = await auth()
    let data = undefined
    if(session){
        data = await db.query.favourites.findMany({
            where: eq(favourites.userId, session.user.id)
        })
    }
    return (
        <SearchFilters session={session!} favourites={data!} />
    )
}