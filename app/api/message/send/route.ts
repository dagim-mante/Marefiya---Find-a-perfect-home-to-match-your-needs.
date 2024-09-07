import { redisDb } from "@/lib/db"
import { Chat, chatArrayValidator, Message, messageValidator } from "@/lib/message-validator"
import { pusherServer } from "@/lib/pusher"
import { fetchRedis } from "@/lib/redis-helper"
import { chatHrefConstructor, toPusherKey } from "@/lib/utils"
import { db } from "@/server"
import { auth } from "@/server/auth"
import { users } from "@/server/schema"
import { eq } from "drizzle-orm"
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

        const recieverId = session.user.id === userId1 ?  userId2: userId1
        const senderId = recieverId === userId1 ?  userId2: userId1 
        const sender = await db.query.users.findFirst({
            where: eq(users.id, senderId)
        })
        if(!sender){
            return new Response("Unauthorized", {status: 401})
        }

        const timestamp = Date.now()
        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timestamp
        }
        const message = messageValidator.parse(messageData)

        const existingChatsReciever = await fetchRedis('lrange', `user:${recieverId}:chats`, 0, -1) as Chat[]
        const existingChatsSender = await fetchRedis('lrange', `user:${senderId}:chats`, 0, -1) as Chat[]
        

        if(!existingChatsReciever && !existingChatsSender){
            await redisDb.rpush(`user:${senderId}:chats`, recieverId)
            await redisDb.rpush(`user:${recieverId}:chats`, senderId)
        }else{
            const alreadyChattingReciever = existingChatsReciever?.find(id => id === senderId)
            const alreadyChattingSender = existingChatsSender?.find(id => id === recieverId)
            if(!alreadyChattingReciever && !alreadyChattingSender){
                await redisDb.rpush(`user:${senderId}:chats`, recieverId)
                await redisDb.rpush(`user:${recieverId}:chats`, senderId)
            }else{
                await redisDb.lrem(`user:${senderId}:chats`, 1, recieverId)
                await redisDb.lrem(`user:${recieverId}:chats`, 1, senderId)
                
                await redisDb.linsert(`user:${senderId}:chats`, "before", existingChatsSender[0], recieverId)
                await redisDb.linsert(`user:${recieverId}:chats`, "before", existingChatsReciever[0], senderId)
            }
            await pusherServer.trigger(toPusherKey(`chat:${senderId}`), 'update_chat_order', {})
            await pusherServer.trigger(toPusherKey(`chat:${recieverId}`), 'update_chat_order', {})
        }

        // send the message
        await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming_message', message)
        await pusherServer.trigger(toPusherKey(`user:${recieverId}:chats`), 'new_message', {
            ...message,
            senderImg: sender.image,
            senderName: sender.name
        })
        await redisDb.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: message
        })

        return new Response('OK')
    }catch(error){
        console.log(error)
        if(error instanceof Error){
            return new Response(error.message, {status: 500})
        }
        return new Response("Internal server error", {status: 500})
    }
}