"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Shield, BarChart3, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/website/theme-toggle"
import Logo from "@/assets/Logo.png"

export function Navbar() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const linkCls =
        "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b transition-all ${scrolled
                ? "bg-background/90 backdrop-blur-md border-border/40 shadow-sm"
                : "bg-background/70 backdrop-blur border-transparent"
                }`}
        >
            <div
                className={`container max-w-7xl flex items-center justify-between transition-all duration-200 ${scrolled ? "py-3" : "py-1"
                    }`}
            >
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-8 w-8">
                        <Image src={Logo} alt="UNICENT Logo" fill className="object-contain" priority />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            UNICENT
                        </span>
                        <span className="hidden sm:block text-[11px] text-muted-foreground">
                            AI‑Powered Budget Management
                        </span>
                    </div>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#features" className={linkCls}>
                        Features
                    </Link>
                    <Link href="#dashboard" className={linkCls}>
                        Analytics
                    </Link>
                    <Link href="#pricing" className={linkCls}>
                        Pricing
                    </Link>
                    <Link href="#faq" className={linkCls}>
                        FAQ
                    </Link>
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/auth/login" className={linkCls}>
                        Sign in
                    </Link>
                    <Link href="/auth/register">
                        <Button size="sm" className="group relative overflow-hidden">
                            <span className="relative z-10">Get started</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                    </Link>
                </div>

                {/* Mobile trigger */}
                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Toggle menu"
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
                    <div className="container py-4 grid gap-3">
                        <Link href="#features" className={linkCls} onClick={() => setOpen(false)}>
                            <span className="inline-flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-500" /> Features
                            </span>
                        </Link>
                        <Link href="#dashboard" className={linkCls} onClick={() => setOpen(false)}>
                            <span className="inline-flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-indigo-500" /> Analytics
                            </span>
                        </Link>
                        <Link href="#pricing" className={linkCls} onClick={() => setOpen(false)}>
                            Pricing
                        </Link>
                        <Link href="#faq" className={linkCls} onClick={() => setOpen(false)}>
                            FAQ
                        </Link>

                        <div className="mt-1 flex items-center gap-4">
                            <Link href="/auth/login" className="w-full" onClick={() => setOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                    Sign in
                                </Button>
                            </Link>
                            <Link href="/auth/register" className="w-full" onClick={() => setOpen(false)}>
                                <Button className="w-full">
                                    Get started
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Shield className="h-3.5 w-3.5" />
                            Bank‑grade security · Powens integration · AI insights
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}