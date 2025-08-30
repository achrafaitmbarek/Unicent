"use client"
import { LayoutDashboard, ChartNoAxesCombined, BrainCircuit, SquareUser } from "lucide-react"

import logo from "@/assets/TypoLogo.png";
import LogoImage from "@/assets/Logo.png";

import * as React from "react"

import { NavMain } from "./nav-main"
import {
    Sidebar,
    SidebarContent,
    SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image";
import LaunchCard from "../launch-card";

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: ChartNoAxesCombined
        },
        {
            title: "AI Insights",
            url: "/dashboard/ai-insights",
            icon: BrainCircuit,
            isActive: true,
            items: [
                {
                    title: "Financial Watch",
                    url: "/dashboard/ai-insights/financial-watch",
                },
                {
                    title: "Saving Goals",
                    url: "/dashboard/ai-insights/financial-planning",
                },
                {
                    title: "Smart Budget",
                    url: "/dashboard/ai-insights/smart-budget",
                }
            ],
        },
        {
            title: "Profile",
            url: "/dashboard/profile",
            icon: SquareUser,
        },
    ],
}

import { useSidebar } from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state } = useSidebar()
    return (
        <Sidebar collapsible={'icon'} {...props}>
            <SidebarContent className="bg-white space-y-4 border-r">
                <div className="px-4 pt-4">
                    {state === "collapsed" ? (
                        <div className="flex justify-center">
                            <Image src={LogoImage} alt="logo" width={28} height={28} className="rounded-sm" />
                        </div>
                    ) : (
                        <div className="pl-4">
                            <Image src={logo} alt="logo" width={96} height={36} />
                        </div>
                    )}
                </div>
                <NavMain items={data.navMain} />
                <div className="flex-1" />
                {state === "collapsed" ? (
                    <div className="px-1 pb-3">
                        <LaunchCard variant="compact" />
                    </div>
                ) : (
                    <div className="px-4 pb-6">
                        <LaunchCard />
                    </div>
                )}
            </SidebarContent>
            <SidebarRail className="border-r" />
        </Sidebar>
    )
}