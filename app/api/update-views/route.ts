import { db } from "@/server";
import { views } from "@/server/schema";
import { and, eq, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest) => {
    console.log("req.ip", req)
    const ip = req.headers.get("x-real-ip")
    console.log("ip", ip)
    const userIp = req.ip || 'some ip'
    const {assetId} = await req.json()
    if(!assetId || !userIp){
        return NextResponse.json({error: 'no asset given'}, {status: 404})
    }
    const existingViews = await db.query.views.findMany({
        where: and(
            eq(views.ip, userIp),
            eq(views.assetId, assetId),
            gt(views.created, new Date(new Date().getTime() - 15 * 60 * 1000))
        )
    })

    if(existingViews.length === 0){
        const newview = await db.insert(views).values({
            ip: userIp,
            assetId,
        })
        return NextResponse.json({success: 'view added'}, {status: 201})
    }
    return NextResponse.json({success: 'already view'}, {status: 202})
}