import type { Metadata } from "next"
import { Navbar } from "@/components/website/Navbar"
import { Footer } from "@/components/website/footer"
import PrivacyContent from "@/components/website/legal/PrivacyContent"

export const metadata: Metadata = {
    title: "Privacy Policy • Unicent",
    description: "How Unicent collects, uses, and protects your data.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container max-w-4xl py-12">
                <PrivacyContent />
            </main>
            <Footer />
        </div>
    )
}
