'use client'
import { Message } from '@/lib/message-validator'
import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import UnseenChatToast from './UnseenChatToast'

interface ExtendedMessage extends Message{
    senderName: string,
    senderImg: string
}

export default function NavChat({
    sessionId
}:{
    sessionId: string
}){
    const router = useRouter()
    const pathname= usePathname()
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))

        console.log('USE Effect')
        const messageHandler = (message: ExtendedMessage) => {
            const shouldNotify = `/chat/${chatHrefConstructor(sessionId, message.senderId)}` !== pathname
            if(!shouldNotify) return
            toast(<UnseenChatToast
                    senderId={message.senderId}
                    senderImg={message.senderImg}
                    senderName={message.senderName}
                    sessionId={sessionId}
                    senderMessage={message.text}
                />, {
                duration: 10000
            })
            setUnseenMessages(prev => [...prev, message])
        }

        pusherClient.bind('new_message', messageHandler)
        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
            pusherClient.unbind('new_message', messageHandler)
        }
    },[pathname, sessionId, router] )
    return (
        <div 
          className="cursor-pointer relative px-2"
          onClick={() => {
            router.push('/chat')
          }} 
        >
          <AnimatePresence>
            {unseenMessages.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full"
              >
                {unseenMessages.length}
              </motion.span>
            )}
          </AnimatePresence>
          <MessageSquare />
        </div>
    )
}