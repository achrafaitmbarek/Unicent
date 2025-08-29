"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function ContactForm() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const errs: string[] = []
        if (!fullName.trim()) errs.push("Name is required")
        if (!validateEmail(email)) errs.push("Valid email is required")
        if (!subject.trim()) errs.push("Subject is required")
        if (message.trim().length < 10) errs.push("Message must be at least 10 characters")

        if (errs.length) {
            toast.error("Please fix the form", { description: errs.join(" • ") })
            return
        }

        setSubmitting(true)
        setTimeout(() => {
            setSubmitting(false)
            setFullName("")
            setEmail("")
            setSubject("")
            setMessage("")
            toast.success("Message sent", {
                description: "Thanks! We’ll get back to you within 1 business day.",
            })
        }, 900)
    }

    return (
        <form onSubmit={onSubmit} noValidate className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                    id="fullName"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    aria-invalid={fullName !== "" && !fullName.trim() ? "true" : "false"}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    aria-invalid={email !== "" && !validateEmail(email) ? "true" : "false"}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    aria-invalid={subject !== "" && !subject.trim() ? "true" : "false"}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    placeholder="Write your message…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    aria-invalid={message !== "" && message.trim().length < 10 ? "true" : "false"}
                />
                <p className="text-xs text-muted-foreground">We typically reply within 1 business day.</p>
            </div>
            <div className="flex items-center gap-3">
                <Button type="submit" disabled={submitting} aria-busy={submitting} className="group relative overflow-hidden">
                    <span className="relative z-10">{submitting ? "Sending…" : "Send message"}</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setFullName(""); setEmail(""); setSubject(""); setMessage("") }}>
                    Reset
                </Button>
            </div>
        </form>
    )
}
