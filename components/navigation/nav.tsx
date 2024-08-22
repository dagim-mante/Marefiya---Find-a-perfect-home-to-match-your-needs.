import {auth} from '@/server/auth'
import Image from 'next/image'
import UserButton from './user-button'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { Button } from '../ui/button'

export default async function Nav(){
    const session = await auth()
    return (
        <header className='py-8'>
            <nav>
                <ul className='flex justify-between'>
                    <li>
                        <Link href={'/'} aria-label='Marefiya'>
                            <Image 
                                alt='Logo'
                                src='/logo.svg'
                                width={40}
                                height={35}
                            />
                        </Link>
                    </li>
                    {!session ? (
                        <li>
                            <Button asChild>
                                <Link className='flex gap-2' href='/auth/login'>
                                    <LogIn size={16}/> <span>Login</span>
                                </Link>
                            </Button>
                        </li>
                    ) : (
                        <li>
                            <UserButton user={session?.user} expires={session?.expires}/>    
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}