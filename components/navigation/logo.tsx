'use client'

import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

export default function Logo(){
    const {theme} = useTheme()
    return (
        <Link href={'/'} aria-label='Marefiya'>
            <Image 
                alt='Logo'
                src={theme === 'dark' ? '/logo-dark.png' : '/logo-purple.png'}
                width={200}
                height={50}
                priority
                className="w-44 md:w-56 md:h-10"
            />
        </Link>
    )
}