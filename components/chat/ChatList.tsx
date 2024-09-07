'use client'

import { OwnerProfile } from "@/lib/infer-type"
import { pusherClient } from "@/lib/pusher"
import { chatHrefConstructor, cn, toPusherKey } from "@/lib/utils"
import { formatDistance } from "date-fns"
import { Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type chatWithLastMessageType = {
    activeChat: string,
    lastMessage: Message
}[]

export default function ChatList({
    chats,
    session,
    chatWithLastMessage
}: {
    chats: OwnerProfile[],
    session: Session,
    chatWithLastMessage: chatWithLastMessageType
}){
    const pathname = usePathname()
    const router = useRouter()
    const [activeChats, setActiveChats] = useState(chats)
    const [activeLink, setActiveLink] = useState<string | null>(null)

    useEffect(() => {
        setActiveChats(chats)
    }, [chats])


    useEffect(() => {
        setActiveLink(pathname)
    }, [pathname])

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${session.user.id}`))
        const updateChatOrder = () => {
          router.refresh()
        }
  
        pusherClient.bind('update_chat_order', updateChatOrder)
  
        return () => {
          pusherClient.subscribe(toPusherKey(`chat:${session.user.id}`))
          pusherClient.unbind('incoming_message', updateChatOrder)
        }
      
    }, [chats])

    return (
        <div className="border-r border-gray-300 dark:border-gray-700 lg:col-span-1">
          <ul className="overflow-auto h-[32rem]">
            <h2 className="my-4 ml-2 text-lg text-gray-600 dark:text-gray-300">Chats</h2>
            {activeChats.length > 0 ? (
                <li>
                    {activeChats.map(activeChat => (
                        <Link
                          key={activeChat.id}
                          href={`/chat/${chatHrefConstructor(session.user.id, activeChat.id)}`}
                          className={cn("flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out cursor-pointer focus:outline-none",
                            activeLink === `/chat/${chatHrefConstructor(session.user.id, activeChat.id)}` ? "bg-primary/50 hover:bg-primary/75 dark:bg-primary/75 dark:hover:bg-primary border-b border-gray-300 dark:border-gray-700" : "bg-white hover:bg-gray-200 border-b border-gray-300 dark:bg-black/50 dark:hover:bg-black/75 dark:border-gray-700"
                          )}
                        >
                          <div className="relative w-10 h-10">
                            <Image fill className="relative rounded-full"
                                src={activeChat.image!} alt="username" />
                          </div>
                          <div className="w-full pb-2">
                              <div className="flex justify-between">
                              <span className="block ml-2 font-semibold text-gray-900 dark:text-gray-200">{activeChat.name}</span>
                              <span className="block ml-2 text-sm text-gray-600 dark:text-gray-400">
                                {formatDistance(new Date(), chatWithLastMessage.find(chat => chat.activeChat === activeChat.id)?.lastMessage.timestamp!) || "..."}
                              </span>
                              </div>
                              <span className="block ml-2 text-sm text-gray-600 dark:text-gray-400">
                              {chatWithLastMessage.find(chat => chat.activeChat === activeChat.id)?.lastMessage.senderId === session.user.id ? "You:": ""}{" "}
                                {chatWithLastMessage.find(chat => chat.activeChat === activeChat.id)?.lastMessage.text}
                              </span>
                          </div>
                        </Link>
                    ))}
                </li>
            ) : (
                <li>
                    <h3 className="p-4 font-bold text-gray-800 dark:text-gray-200">No Chats</h3>
                </li>
            )}
            
            
          </ul>
        </div>
    )
}