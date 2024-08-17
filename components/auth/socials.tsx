'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import {FcGoogle} from "react-icons/fc"
import {FaGithub} from "react-icons/fa"

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
            <Button
                variant={'outline'}
                className="flex gap-4 w-full"
                onClick={() => signIn('github', {
                    redirect: false,
                    callbackUrl: '/'
                })}
            >
                <FaGithub />
                <p>Login with Github</p>
            </Button>
        </div>
    )
}