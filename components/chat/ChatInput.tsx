'use client'
import { OwnerProfile } from "@/lib/infer-type"
import { useRef, useState } from "react"
import { Button } from "../ui/button"
import axios from "axios"
import { toast } from "sonner"

export default function ChatInput({
    chatId,
    chatPartner
}: {
    chatId: string,
    chatPartner: OwnerProfile
}){
    const textareaRef = useRef<HTMLInputElement | null>(null)
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const sendMessage = async () => {
        if(!input){
            return
        }
        setIsLoading(true)
        try{
            await axios.post('/api/message/send', {text: input, chatId})
            setInput('')
            textareaRef.current?.focus()
        }catch{
            toast.error('Something went wrong.Try again.')
        }finally{
            setIsLoading(false)
        }
    }

    return (
    <div className="pb-5 flex items-center justify-between w-full p-3 border-t border-gray-300 dark:border-gray-700 ">
        <input 
            type="text"
            ref={textareaRef}
            className="relative block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-md outline-none focus:text-gray-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${chatPartner.name}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
            }}
        />
        <Button 
            disabled={isLoading}
            onClick={sendMessage}
            className="mr-1 rounded-full"
        >
            <svg className="w-5 h-5 text-white origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20" fill="currentColor">
                <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
        </Button>
    </div> 
    )
}