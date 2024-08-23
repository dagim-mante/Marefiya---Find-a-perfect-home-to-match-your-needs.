'use client'

import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Dispatch, forwardRef, SetStateAction, useState } from "react"
import { useFormContext } from "react-hook-form"
import {AnimatePresence, motion} from "framer-motion"
import { XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type InputTagsProps = InputProps & {
    value: string[],
    onChange: Dispatch<SetStateAction<string[]>>
}

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({value, onChange, ...props}, ref: InputTagsProps) => {
    const [pendingDataPoint, setPendingDataPoint] = useState('')
    const [focused, setFocused] = useState(false)

    function addDataPoint(){
        if(pendingDataPoint){
            const newDataPoints = new Set([...value, pendingDataPoint])
            onChange(Array.from(newDataPoints))
            setPendingDataPoint("")
        }
    }

    const {setFocus} = useFormContext()
    return (
        <div className={cn('w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            focused ? 'ring-offset-2 outline-none ring-ring ring-2' : 'ring-offset-0 outline-none ring-ring ring-0'
        )} onClick={() => setFocus('tags')}>
            <motion.div className="rounded-md min-h-[2.5rem] p-2 flex gap-2 flex-wrap items-center">
                <AnimatePresence>
                    {value.map(tag => (
                        <motion.div
                            initial={{scale: 0}}
                            animate={{scale: 1}}
                            exit={{scale: 0}}
                            key={tag}
                        >
                            <Badge variant={'secondary'}>{tag}</Badge>
                            <button
                                className="w-3 ml-1"
                                onClick={e => {
                                    e.preventDefault()
                                    onChange(value.filter(t => t != tag))
                                }}
                            >
                                <XIcon className="w-3" />
                            </button>
                        </motion.div>    
                    ))}
                </AnimatePresence>        
                <div className="flex">
                    <Input
                        className="focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        onKeyDown={(e) => {
                            if(e.key === 'Enter'){
                                e.preventDefault()
                                addDataPoint()
                            }
                            if(e.key === 'Backspace' && !pendingDataPoint && value.length > 0){
                                e.preventDefault()
                                const newValue = [...value]
                                newValue.pop()
                                onChange(newValue)
                            }
                        }}
                        value={pendingDataPoint}
                        onChange={e => setPendingDataPoint(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlurCapture={() => setFocused(false)}
                        {...props}
                    />
                </div>
            </motion.div>
        </div>
    )
})

InputTags.displayName = "InputTags"