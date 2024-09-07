import ChatList from "@/components/chat/ChatList"
import { OwnerProfile } from "@/lib/infer-type"
import { fetchRedis } from "@/lib/redis-helper"
import { db } from "@/server"
import { auth } from "@/server/auth"
import { users } from "@/server/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import DynamicChatLayout from "./dynamic-layout"
import { chatHrefConstructor } from "@/lib/utils"
import { Message } from "@/lib/message-validator"

export default async function ChatLayout({
    children
}: {
  children: ReactNode
}){
  const session = await auth()
  if(!session){
    return redirect('/auth/login')
  }

  const activeChats = await fetchRedis('lrange', `user:${session.user.id}:chats`, 0 ,-1) as string[]

  const chatWithLastMessage = await Promise.all(
    activeChats.map(async (activeChat) => {
      const [lastMessageRaw] = await (fetchRedis(
        'zrange',
        `chat:${chatHrefConstructor(activeChat, session.user.id)}:messages`,
         -1, -1)) as string[]
      const lastMessage = JSON.parse(lastMessageRaw) as Message
      return {
        activeChat,
        lastMessage
      }
    })
  )

  let chats:OwnerProfile[] = []
  if(activeChats.length > 0){
    for(let i = 0; i < activeChats.length; i++){
      const filledChats = await db.query.users.findFirst({
        where: eq(users.id, activeChats[i])
      })
      chats.push(filledChats!)
    }
  }
    return (
      <div className="container mx-auto">
        <div className="h-[calc(100vh-9rem)] max-w-7xl lg:container mx-auto">
          <div className="min-h-full min-w-full border border-gray-200 dark:border-gray-700 rounded lg:grid lg:grid-cols-3">
            <DynamicChatLayout chatWithLastMessage={chatWithLastMessage} children={children} chats={chats} session={session} />
          </div>
        </div>
      </div>
    )
}