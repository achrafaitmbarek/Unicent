import type { Metadata } from "next"
import { Navbar } from "@/components/website/Navbar"
import { Footer } from "@/components/website/footer"
import TermsContent from "@/components/website/legal/TermsContent"

export const metadata: Metadata = {
    title: "Terms of Service • Unicent",
    description: "The terms that govern the use of Unicent.",
}

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container max-w-4xl py-12">
                <TermsContent />
            </main>
            <Footer />
        </div>
    )
}
