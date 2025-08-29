"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, LineChart, PiggyBank, Search, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarMenuProps {
  className?: string
}

export function SidebarMenu({ className }: SidebarMenuProps) {
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: LineChart, label: "AI Insights", href: "/insights", highlight: true },
    { icon: PiggyBank, label: "Savings Goals", href: "/savings" },
    { icon: User, label: "Profile", href: "/profile" },
  ]

  return (
    <div className={cn("flex flex-col gap-2 py-2", className)}>
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search here"
            className="w-full rounded-md border border-input bg-white px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant={item.highlight ? "default" : "ghost"}
          className={cn(
            "justify-start gap-2 px-3",
            item.highlight ? "bg-[#0a2540] text-white hover:bg-[#0a2540]/90" : "",
            pathname === item.href ? "bg-muted font-medium" : "font-normal",
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </div>
  )
}
