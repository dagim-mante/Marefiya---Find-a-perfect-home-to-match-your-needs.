import {auth} from '@/server/auth'
import Image from 'next/image'
import UserButton from './user-button'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { Button } from '../ui/button'
import NavChat from '../chat/NavChat'

export default async function Nav(){
    const session = await auth()
    return (
        <header className='h-28 py-8'>
            <nav>
                <ul className='flex justify-between items-center'>
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
                        <li className="flex items-center gap-2">
                            <Button className="hover:bg-primary hover:text-white" variant={'secondary'} asChild>
                                <Link className="flex items-center gap-2" href='/auth/login'>
                                    <LogIn size={12}/> <span>Login</span>
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href='/auth/register'>
                                    <span>Sign up</span>
                                </Link>
                            </Button>
                        </li>
                    ) : (
                        <div className="flex items-center gap-4">
                            <li className="relative flex items-center hover:bg-muted">
                                <NavChat 
                                    sessionId={session.user.id}
                                />
                            </li>
                            <li>
                                <UserButton user={session?.user} expires={session?.expires}/>    
                            </li>
                        </div>
                    )}
                </ul>
            </nav>
        </header>
    )
}