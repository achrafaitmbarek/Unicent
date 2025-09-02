import type { Metadata } from "next"
import { Navbar } from "@/components/website/Navbar"
import { Footer } from "@/components/website/footer"
import PrivacyContent from "@/components/website/legal/PrivacyContent"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Privacy Policy • Unicent",
    description: "How Unicent collects, uses, and protects your data.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/40 dark:to-background/80 relative">
            <Navbar />
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute left-1/2 top-0 w-[600px] h-[300px] -translate-x-1/2 bg-gradient-to-br from-blue-400/10 via-fuchsia-300/10 to-transparent rounded-full blur-2xl"></div>
            </div>
            <main className="container max-w-2xl py-16 flex flex-col items-center">
                <div className="flex flex-col items-center mb-10">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4 mb-4 shadow">
                        <Shield className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-center">Privacy Policy</h1>
                    <p className="text-muted-foreground text-center max-w-xl mb-4">How Unicent collects, uses, and protects your data.</p>
                    <Button asChild variant="ghost" size="sm" className="mb-2" >
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Link>
                    </Button>
                </div>
                <div className="w-full bg-white/90 dark:bg-background/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-border/40">
                    <PrivacyContent />
                </div>
            </main>
            <Footer />
        </div>
    )
}
