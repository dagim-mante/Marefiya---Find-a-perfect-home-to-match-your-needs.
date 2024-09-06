'use client'

import { chatHrefConstructor, cn } from "@/lib/utils"
import { X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function UnseenChatToast({
    sessionId,
    senderId,
    senderImg,
    senderName,
    senderMessage
}: {
    sessionId: string,
    senderId: string,
    senderImg: string,
    senderName: string,
    senderMessage: string
}){
    return (
    <div
      className={cn(
        'max-w-md w-full bg-indigo-900 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5'
      )}>
        <a
            onClick={() => toast.dismiss()}
            href={`/chat/${chatHrefConstructor(sessionId, senderId)}`}
            className='flex-1 w-0 p-4'>
            <div className='flex items-start'>
            <div className='flex-shrink-0 pt-0.5'>
                <div className='relative h-10 w-10'>
                <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={senderImg}
                    alt={`${senderName} profile picture`}
                />
                </div>
            </div>

            <div className='ml-3 flex-1'>
                <p className='text-sm font-medium text-gray-200'>{senderName}</p>
                <p className='mt-1 text-sm text-gray-400'>{senderMessage}</p>
            </div>
            </div>
        </a>

        <div className='flex relative'>
            <button
            onClick={() => toast.dismiss()}
            className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-200 hover:text-white focus:outline-none focus:text-white'>
               <X className="h-4 w-4" />
            </button>
        </div>
    </div>
    )
}