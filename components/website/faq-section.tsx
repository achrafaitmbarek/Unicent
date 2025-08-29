import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
    const faqs = [
        {
            question: "What is UC Wealth?",
            answer:
                "UC Wealth is an AI-powered financial management platform that helps you track your spending, set budgets, save money, and achieve your financial goals through personalized insights and recommendations.",
        },
        {
            question: "How does the AI technology work?",
            answer:
                "Our AI analyzes your spending patterns, income, and financial goals to provide personalized recommendations. It identifies areas where you can save money, predicts future expenses, and helps you make smarter financial decisions.",
        },
        {
            question: "Is my financial data secure?",
            answer:
                "Yes, we take security very seriously. We use bank-level encryption to protect your data, and we never store your bank credentials. We also use two-factor authentication and other security measures to keep your information safe.",
        },
        {
            question: "Can I connect multiple bank accounts?",
            answer:
                "Yes, you can connect multiple bank accounts, credit cards, investment accounts, and more. The Free plan allows up to 2 accounts, while the Pro and Family plans offer unlimited account connections.",
        },
        {
            question: "Is there a mobile app available?",
            answer:
                "Yes, UC Wealth is available on iOS and Android devices. You can download the app from the App Store or Google Play Store and access all features on the go.",
        },
        {
            question: "How do I cancel my subscription?",
            answer:
                "You can cancel your subscription at any time from your account settings. If you cancel, you'll still have access to your paid features until the end of your billing period.",
        },
        {
            question: "Do you offer a free trial?",
            answer:
                "Yes, we offer a 14-day free trial for our Pro and Family plans. You can try all the features without any commitment, and you won't be charged if you cancel before the trial period ends.",
        },
        {
            question: "Can I export my financial data?",
            answer:
                "Yes, you can export your financial data in various formats, including CSV, PDF, and Excel. This makes it easy to use your data for tax purposes or other financial planning.",
        },
    ]

    return (
        <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-medium text-[#0a1929]">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
