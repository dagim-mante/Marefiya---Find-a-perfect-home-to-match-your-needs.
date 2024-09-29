'use client'
import React from 'react';
import Logo from '../navigation/logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {
    const pathname = usePathname()
    if(pathname.includes('/chat')){
        return null
    }
  return (
    <footer>
        <div className="mt-4 bg-gray-200 dark:bg-gray-800 flex flex-col shrink-0 rounded-sm px-6 md:px-12 mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-4">
                <Logo />
                <ul className='mt-2 flex flex-col gap-2 items-center sm:items-start'>
                    <li><Link className="hover:text-primary" href="/about_us">About Us</Link></li>
                    <li><Link className="hover:text-primary" href="#">Contact us: +251 91 103 3218</Link></li>
                </ul>
            </div>
            <p className="text-center">Copyright &copy; {new Date().getFullYear()}, All Rights Reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;