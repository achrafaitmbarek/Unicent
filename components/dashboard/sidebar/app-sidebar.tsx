"use client"
import { LayoutDashboard, ChartNoAxesCombined, BrainCircuit, SquareUser } from "lucide-react"

import logo from "@/assets/TypoLogo.png";

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
                    url: "/dashboard/ai-insights/saving-goals",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible={'icon'} {...props}>
            <SidebarContent className="bg-white space-y-6 border-r">
                <div className="ml-8 mt-6 mb-4">
                    <Image src={logo} alt="logo" width={80} height={30} />
                </div>
                <NavMain items={data.navMain} />
                <div className="flex flex-1 justify-center items-end w-full pb-6 mt-auto">
                    <LaunchCard />
                </div>
            </SidebarContent>
            <SidebarRail className="bg-white border-r" />
        </Sidebar>
    )
}