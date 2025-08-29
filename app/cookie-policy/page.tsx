import type { Metadata } from "next"
import { Navbar } from "@/components/website/Navbar"
import { Footer } from "@/components/website/footer"
import CookieContent from "@/components/website/legal/CookieContent"

export const metadata: Metadata = {
    title: "Cookie Policy • Unicent",
    description: "How Unicent uses cookies and similar technologies.",
}

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container max-w-4xl py-12">
                <CookieContent />
            </main>
            <Footer />
        </div>
    )
}
