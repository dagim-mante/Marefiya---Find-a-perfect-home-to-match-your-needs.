'use client'

import { OwnerProfile } from "@/lib/infer-type"
import { chatHrefConstructor } from "@/lib/utils"
import { Session } from "next-auth"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ChatList({
    chats,
    session
}: {
    chats: OwnerProfile[],
    session: Session
}){
    const [activeChats, setActiveChats] = useState(chats)

    useEffect(() => {
        setActiveChats(chats)
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
                          className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out bg-gray-100 border-b border-gray-300 dark:border-gray-700 cursor-pointer focus:outline-none">
                          <img className="object-cover w-10 h-10 rounded-full"
                              src={activeChat.image!} alt="username" />
                          <div className="w-full pb-2">
                              <div className="flex justify-between">
                              <span className="block ml-2 font-semibold text-gray-600">{activeChat.name}</span>
                              <span className="block ml-2 text-sm text-gray-600">50 minutes</span>
                              </div>
                              <span className="block ml-2 text-sm text-gray-600">Good night</span>
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