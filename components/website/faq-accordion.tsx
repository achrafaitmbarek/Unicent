"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqAccordion() {
    const faqs = [
        {
            question: "What is Unicent?",
            answer:
                "Unicent is an AI‑assisted money management platform. Connect your bank accounts, categorize transactions, track savings goals, and get data‑driven tips to optimize spending and grow savings.",
        },
        {
            question: "How does bank sync work?",
            answer:
                "We use Powens to connect to your bank in read‑only mode. Your credentials are never stored on our servers—the connection is token‑based—and you can revoke access at any time from your bank or from Unicent.",
        },
        {
            question: "Is my data secure?",
            answer:
                "Yes. We use bank‑grade encryption in transit and at rest, strict access controls, and optional 2FA. Bank connections are read‑only—we can’t move money. We’re GDPR‑compliant and you can delete your data from settings.",
        },
        {
            question: "What insights do I get?",
            answer:
                "Automatic categorization, anomaly detection for unusual or risky spend, personalized tips, and category‑level optimization suggestions to reduce recurring costs.",
        },
        {
            question: "Can I connect multiple bank accounts?",
            answer:
                "Free includes 1 synced account. Premium supports multi‑account sync across banks and cards, with faster refresh and priority processing.",
        },
        {
            question: "How do savings goals work?",
            answer:
                "Create goals with a target amount/date and a monthly allocation. Track progress in real time and get nudges when you’re off track or when we find room to save.",
        },
        {
            question: "What reports are available?",
            answer:
                "Weekly, monthly, and annual reports covering income, spending by category, top merchants, anomalies, and goal progress.",
        },
        {
            question: "Can I cancel anytime?",
            answer:
                "Yes. You can cancel Premium at any time from Billing. Your plan remains active until the end of the current period.",
        },
    ]

    return (
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <AccordionItem value={`item-${index}`} className="border-border/60">
                        <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                </motion.div>
            ))}
        </Accordion>
    )
}
