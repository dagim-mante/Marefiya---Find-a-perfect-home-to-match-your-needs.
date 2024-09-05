import { redisDb } from "@/lib/db"
import { Message, messageValidator } from "@/lib/message-validator"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { auth } from "@/server/auth"
import {nanoid} from "nanoid"

export async function POST(req: Request){
    try{
        const {text, chatId} = await req.json()

        const session = await auth()
        if(!session){
            return new Response("Unauthorized", {status: 401})
        }
        
        const [userId1, userId2] = chatId.split('--')
        if(session.user.id !== userId1 && session.user.id !== userId2){
            return new Response("Unauthorized", {status: 401})
        }

        const reciverId = session.user.id === userId1 ?  userId2: userId1
        const timestamp = Date.now()
        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timestamp
        }
        const message = messageValidator.parse(messageData)

        // send the message
        await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming_message', message)
        await redisDb.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: message
        })

        return new Response('OK')
    }catch(error){
        if(error instanceof Error){
            return new Response(error.message, {status: 500})
        }
        return new Response("Internal server error", {status: 500})
    }
}