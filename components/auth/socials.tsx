'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import {FcGoogle} from "react-icons/fc"

export default function Socials(){
    return (
        <div className='flex flex-col items-center w-full gap-4'>
            <Button
                variant={'outline'}
                className="flex gap-4 w-full"
                onClick={() => signIn('google', {
                    redirect: false,
                    callbackUrl: '/'
                })}
            >
                <FcGoogle />
                <p>Login with Google</p>
            </Button>
        </div>
    )
}