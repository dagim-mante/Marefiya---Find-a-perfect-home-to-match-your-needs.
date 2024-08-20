'use client'
import { useTheme } from 'next-themes'
import {Toaster as Toasty} from 'sonner'

export default function Toaster(){
    const {theme} = useTheme()
    if(typeof theme === 'string'){
        return (
            <Toasty richColors theme={theme as 'system' | 'light' | 'dark' | undefined}/>
        )
    }
}