'use client'

import ChatList from "@/components/chat/ChatList"
import { OwnerProfile } from "@/lib/infer-type"
import { cn } from "@/lib/utils"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

type chatWithLastMessageType = {
    activeChat: string,
    lastMessage: Message
}[]

export default function DynamicChatLayout({
    children,
    chats,
    session,
    chatWithLastMessage
}: {
    children: ReactNode,
    chats: OwnerProfile[],
    session: Session,
    chatWithLastMessage: chatWithLastMessageType
}){

    const pathname = usePathname()

    return (
    <>
        {/* Chat List */}
        <div className={
            cn(
                pathname === "/chat" ? "" : "hidden",
                "lg:block border-r border-gray-200 dark:border-gray-700 lg:col-span-1"
            )
        }>
            <ChatList chatWithLastMessage={chatWithLastMessage} chats={chats} session={session} />
        </div>

        <div className={
            cn(
                pathname === "/chat" ? "hidden" : "",
                "min-h-full lg:col-span-2 lg:block",
            )
        }>
            <div className="w-full h-full">
            {children}
            </div>
        </div>
    </>
    )
}