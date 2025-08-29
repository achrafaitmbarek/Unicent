"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      quote:
        "UC's wealth insights have revolutionized how I budget and save. It's simple yet powerful - exactly what I needed.",
      author: "Sara Davis",
      title: "Small Business Owner",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "The AI recommendations have helped me save over $2,000 in just three months. I never realized how much I was overspending until UC showed me.",
      author: "Michael Johnson",
      title: "Software Engineer",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "As someone who always struggled with budgeting, UC Wealth has been a game-changer. The interface is intuitive and the insights are genuinely helpful.",
      author: "Jessica Kim",
      title: "Marketing Director",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative">
      <div className="flex overflow-hidden">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className={cn("min-w-full transition-transform duration-500 ease-in-out border-0 shadow-lg", {
              "translate-x-0": index === activeIndex,
              "-translate-x-full": index < activeIndex,
              "translate-x-full": index > activeIndex,
            })}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-3 mb-6">
                  <Quote className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-[#0a1929]">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <Button variant="outline" size="icon" className="rounded-full" onClick={prevTestimonial}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous testimonial</span>
        </Button>
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === activeIndex ? "bg-blue-600" : "bg-gray-300",
              )}
              onClick={() => setActiveIndex(index)}
            >
              <span className="sr-only">Testimonial {index + 1}</span>
            </button>
          ))}
        </div>
        <Button variant="outline" size="icon" className="rounded-full" onClick={nextTestimonial}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next testimonial</span>
        </Button>
      </div>
    </div>
  )
}
