'use client'

import { OwnerProfile } from "@/lib/infer-type"
import { Message } from "@/lib/message-validator"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Session } from "next-auth"
import Image from "next/image"
import { useRef, useState } from "react"

export default function Messages({
    intialMessages,
    session,
    chatId,
    chatPartner
}: {
    intialMessages: Message[],
    session: Session,
    chatId: string,
    chatPartner: OwnerProfile
}){
    const [messages, setMessgaes] = useState<Message[]>(intialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    const formatTime = (timestamp: number) => {
      return format(timestamp, "HH:mm")
    }
    return (
        <div
            id='messages'
            className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
        >
            <div ref={scrollDownRef} />
            {messages.map((message, index) => {
                const isCurrentUser = message.senderId === session.user.id
                const hasNextMessageFromSameUser =
                    messages[index - 1]?.senderId === messages[index].senderId

                return (
                    <div
                      className='chat-message'
                      key={`${message.id}-${message.timestamp}`}>
                      <div
                        className={cn('flex items-end', {
                          'justify-end': isCurrentUser,
                        })}>
                        <div
                          className={cn(
                            'flex flex-col space-y-2 text-base max-w-xs mx-2',
                            {
                              'order-1 items-end': isCurrentUser,
                              'order-2 items-start': !isCurrentUser,
                            }
                          )}>
                          <span
                            className={cn('px-4 py-2 rounded-lg inline-block', {
                              'bg-indigo-600 text-white': isCurrentUser,
                              'bg-gray-200 text-gray-900': !isCurrentUser,
                              'rounded-br-none':
                                !hasNextMessageFromSameUser && isCurrentUser,
                              'rounded-bl-none':
                                !hasNextMessageFromSameUser && !isCurrentUser,
                            })}>
                            {message.text}{' '}
                            <span className='ml-2 text-xs text-gray-400'>
                              {formatTime(message.timestamp)}
                            </span>
                          </span>
                        </div>
          
                        <div
                          className={cn('relative w-6 h-6', {
                            'order-2': isCurrentUser,
                            'order-1': !isCurrentUser,
                            invisible: hasNextMessageFromSameUser,
                          })}>
                          <Image
                            fill
                            src={
                              isCurrentUser ? (session.user.image!) : chatPartner.image!
                            }
                            alt='Profile picture'
                            referrerPolicy='no-referrer'
                            className='rounded-full'
                          />
                        </div>
                      </div>
                    </div>
                  )
            })}
      </div>
    )
} 