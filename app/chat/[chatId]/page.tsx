import ChatInput from "@/components/chat/ChatInput"
import Messages from "@/components/chat/Messages"
import { messageArrayValidator } from "@/lib/message-validator"
import { fetchRedis } from "@/lib/redis-helper"
import { db } from "@/server"
import { auth } from "@/server/auth"
import { users } from "@/server/schema"
import { eq } from "drizzle-orm"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
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
        <main className="relative w-full flex flex-col h-full">
            {/* Top Profile */}
            <div className="relative h-16">
              <div className="flex items-center p-3 border-b border-gray-300 dark:border-gray-700">
                <Link href='/chat'>
                    <ArrowLeft className="w-6 h-6 mr-2"/>
                </Link>
                <div className="relative object-cover w-10 h-10">
                    <Image 
                        fill
                        className="relative rounded-full"
                        src={chatPartner.image!} 
                        alt={chatPartner.name} 
                    />
                </div>
                <Link 
                    href={chatPartner.role === 'owner' ? `/profile/${chatPartner.id}` : '#' } 
                    className="dark:text-gray-200 block ml-2 text-lg font-bold text-gray-600 hover:text-primary"
                >
                    {chatPartner.name}
                </Link>
              </div>
            </div>
            
            <Messages 
                chatId={chatId}
                chatPartner={chatPartner}
                intialMessages={intialMessages}
                session={session}
            />
        </main>
    )
}