import ChatList from "@/components/chat/ChatList"
import { OwnerProfile } from "@/lib/infer-type"
import { fetchRedis } from "@/lib/redis-helper"
import { db } from "@/server"
import { auth } from "@/server/auth"
import { users } from "@/server/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

export default async function ChatLayout({
    children
}: {
    children: ReactNode
}){
    const session = await auth()
    if(!session){
      return redirect('/auth/login')
    }

    const activeChats = await fetchRedis('lrange', `user:${session.user.id}:chats`, 0 ,-1)

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
    <div className="h-[calc(100vh-9rem)] max-w-7xl lg:container mx-auto">
      <div className="h-full min-w-full border rounded dark:border-gray-700 lg:grid lg:grid-cols-3">
        {/* Chat List */}
        <ChatList chats={chats} session={session} />
        
        {/* Chat Window */}
        <div className="relative hidden lg:col-span-2 lg:block">
          {children}
        </div>
      </div>
    </div>
    )
}