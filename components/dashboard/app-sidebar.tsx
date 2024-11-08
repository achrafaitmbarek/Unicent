import { Brain, Calendar, Home, Inbox, Settings, Briefcase, Book, Building, Phone } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "../ui/button";
import { signOut } from "@/auth";

// Menu items.

const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
        variant: "ghost"
    },
    {
        title: "AI Services",
        collapsible: true,
        icon: Brain,
        items: [
            {
                title: "Jobs",
                url: "/dashboard/jobs",
                icon: Briefcase,
            },
            {
                title: "Blogs",
                url: "/dashboard/blogs",
                icon: Book,
            },
            {
                title: "Real Estate",
                url: "/dashboard/real-estate",
                icon: Building,
            }
        ]
    },
    {
        title: "Communication",
        collapsible: true,
        icon: Inbox,
        items: [
            {
                title: "Contacts",
                url: "/dashboard/contacts",
                icon: Phone,
            },
            {
                title: "Inbox",
                url: "#",
                icon: Inbox,
            },
            {
                title: "Calendar",
                url: "#",
                icon: Calendar,
            },
        ]
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
        variant: "ghost"
    }
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        {item.url && <Link href={item.url}>
                                            <item.icon />
                                            <span>
                                                {item.title}
                                            </span>
                                        </Link>}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <Button variant='default' className="mx-6 mb-10" onClick={async () => {
                "use server"
                await signOut();
            }}>
                SignOut
            </Button>
        </Sidebar>
    )
}
