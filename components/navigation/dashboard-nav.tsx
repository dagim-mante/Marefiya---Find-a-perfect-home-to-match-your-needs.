'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {motion, AnimatePresence } from "framer-motion"

type allLinksType =  {
    label: string,
    path: string,
    icon: JSX.Element
}[]

export default function DashboardNav({allLinks}: {allLinks: allLinksType}){
    const pathname = usePathname()
    return (
        <nav className="py-4 overflow-auto mb-4">
            <ul className="flex gap-6 text-xs font-semibold">
                <AnimatePresence>
                    {allLinks.map(link => (
                        <motion.li whileTap={{scale: 0.85}} key={link.path}>
                            <Link
                                href={link.path}
                                className={cn(
                                    "flex gap-1 flex-col items-center relative", 
                                    pathname === link.path && "text-primary" 
                                )}
                            >
                                {link.icon}
                                {link.label}
                                {pathname === link.path ? (
                                    <motion.div
                                        className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                                        initial={{scale: 0.5}}
                                        animate={{scale: 1}}
                                        layoutId="underline"
                                        transition={{type: 'spring', stiffness: 35}}
                                    />
                                ): null }
                            </Link>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </nav>
    )
}