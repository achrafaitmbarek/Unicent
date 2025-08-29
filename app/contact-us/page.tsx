import type { Metadata } from "next"
import { Navbar } from "@/components/website/Navbar"
import { Footer } from "@/components/website/footer"
import { ContactForm } from "@/components/website/ContactForm"

export const metadata: Metadata = {
    title: "Contact Us • Unicent",
    description: "Get in touch with the Unicent team.",
}

export default function ContactUsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container max-w-5xl py-12">
                <div className="grid gap-10 lg:gap-16 lg:grid-cols-3">
                    <section className="lg:col-span-2">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Contact Us</h1>
                        <p className="text-sm text-muted-foreground mb-8">
                            Questions, feedback, or partnership ideas? Drop us a line and we’ll get back to you shortly.
                        </p>
                        <ContactForm />
                    </section>
                    <aside className="rounded-lg border bg-muted/20 p-6 h-fit">
                        <h2 className="font-semibold mb-3">Company</h2>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                            <li>Email: <a className="underline underline-offset-4" href="mailto:hello@unicent.app">hello@unicent.app</a></li>
                            <li>Privacy: <a className="underline underline-offset-4" href="mailto:privacy@unicent.app">privacy@unicent.app</a></li>
                            <li>Legal: <a className="underline underline-offset-4" href="mailto:legal@unicent.app">legal@unicent.app</a></li>
                        </ul>
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">Support hours</h3>
                            <p className="text-sm text-muted-foreground">Mon–Fri, 9am–6pm CET</p>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    )
}
