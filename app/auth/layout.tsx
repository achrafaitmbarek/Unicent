
"use client"
import Logo from '@/assets/TypoLogo.png'
import LoginAvatar from '@/assets/login_avatar.png'
import CointLogo from '@/assets/CointLogo.png'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const buttonConfig = {
        '/auth/login': {
            text: 'Register',
            href: '/auth/register'
        },
        '/auth/register': {
            text: 'Sign In',
            href: '/auth/login'
        }
    }[pathname] ?? {
        text: 'Sign In',
        href: '/auth/login'
    }

    let message;
    let linkText;
    let linkHref;

    if (pathname === '/auth/login') {
        message = "New here?";
        linkText = "Register";
        linkHref = "/auth/register";
    } else if (pathname === '/auth/register') {
        message = "I'm already a member?";
        linkText = "Login";
        linkHref = "/auth/login";
    } else {
        message = "Default message";
        linkText = "Default link text";
        linkHref = "/";
    }
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="h-screen w-full mx-auto flex flex-row ">
                <div className="w-full h-full hidden lg:flex flex-col bg-[#01162C] p-8">
                    <div className="flex items-start gap-4 mb-20">
                        <Image
                            src={CointLogo}
                            alt="UC Wealth Logo"
                            width={50}
                            height={50}
                        />
                        <div className="flex flex-col">
                            <h1 className="text-white text-2xl font-semibold mb-3">
                                UC Wealth
                            </h1>
                            <p className="text-gray-300 text-sm max-w-md leading-relaxed">
                                {`"UC's AI-driven insights have revolutionized how I budget and save.
                                    It's simple yet powerful - exactly what I needed."`}
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Sofia Davis
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        <Image
                            src={LoginAvatar}
                            alt="Login Avatar"
                            className="max-h-[600px] w-auto"
                            priority
                        />
                    </div>
                </div>

                <div className="w-full h-full flex flex-col">
                    <div className="flex justify-between items-center p-10">
                        <Image src={Logo} alt="LuxeHome Logo" height={40} />

                        <Button variant="default" size="lg" asChild>
                            <Link href={buttonConfig.href}>
                                {buttonConfig.text}
                            </Link>
                        </Button>

                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        {children}
                    </div>
                    <div className="text-center mt-auto mb-6">
                        <p className="text-gray-600 font-medium">
                            {message} {''}
                            <Link href={linkHref} className="underline font-medium">
                                {linkText}
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}