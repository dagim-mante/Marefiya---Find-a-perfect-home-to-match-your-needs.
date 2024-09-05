import ChatInput from "@/components/chat/ChatInput"
import Messages from "@/components/chat/Messages"
import { messageArrayValidator } from "@/lib/message-validator"
import { fetchRedis } from "@/lib/redis-helper"
import { db } from "@/server"
import { auth } from "@/server/auth"
import { users } from "@/server/schema"
import { eq } from "drizzle-orm"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"


async function getIntialMessages(chatId: string){
    try{
        const results:string[] = await fetchRedis('zrange', 
            `chat:${chatId}:messages`,
            0,
            -1
        )
        const dbMessages = results.map(message => JSON.parse(message) as Message)
        const reversedDbMessages = dbMessages.reverse()
        const messages = messageArrayValidator.parse(reversedDbMessages)
        return messages
    }catch{
        notFound()
    }
}

export default async function Chat({
    params: {chatId}
}:{
    params: {chatId: string}
}){
    const session = await auth()
    if(!session){
        return redirect('/auth/login')
    }

    const [userId1, userId2] = chatId.split('--')
    if(session.user.id !== userId1 && session.user.id !== userId2){
        notFound()
    }

    const chatPartnerId = session.user.id === userId1 ? userId2 : userId1
    const chatPartner = await db.query.users.findFirst({
        where: eq(users.id, chatPartnerId)
    })
    if(!chatPartner){
        notFound()
    }
    const intialMessages = await getIntialMessages(chatId)

    return (
        <main className="h-screen">
            <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-8rem)]'>
                <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
                <div className='relative flex items-center space-x-4'>
                    <div className='relative'>
                    <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                        <Image
                            fill
                            referrerPolicy='no-referrer'
                            src={chatPartner.image!}
                            alt={`${chatPartner.name} profile picture`}
                            className='rounded-full'
                        />
                    </div>
                    </div>
        
                    <div className='flex flex-col leading-tight'>
                    <div className='text-xl flex items-center'>
                        <span className='text-gray-700 mr-3 font-semibold'>
                        {chatPartner.name}
                        </span>
                    </div>
        
                    <span className='text-sm text-gray-600'>{chatPartner.email}</span>
                    </div>
                </div>
            </div>
            <Messages 
                chatId={chatId}
                chatPartner={chatPartner}
                intialMessages={intialMessages}
                session={session}
            />
            <ChatInput
                chatId={chatId}
                chatPartner={chatPartner} 
            />
            </div>
        </main>
    )
}