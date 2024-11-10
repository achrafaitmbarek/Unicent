"use client"
import { ChevronRight, type LucideIcon } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useState } from "react"
import Link from 'next/link'

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    const [activeItem, setActiveItem] = useState<string | null>(null);

    const handleItemClick = (title: string) => {
        setActiveItem(title);
    };

    return (
        <SidebarGroup>
            <SidebarMenu className=" text-gray-500 space-y-2 ">
                {items.map((item) => {
                    // If the item has no subitems, render a simple button
                    if (!item.items?.length) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    size={'lg'}
                                    asChild
                                    tooltip={item.title}
                                    className={` p-6 active:bg-none text-md hover:bg-gray-900 hover:text-white 
                                             ${activeItem === item.title ? 'bg-gray-900 text-white' : ''}`}
                                    onClick={() => handleItemClick(item.title)}
                                >
                                    <Link href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }

                    // If the item has subitems, render the collapsible version
                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        className={`mb-4 p-6 active:bg-none text-md hover:bg-gray-900 hover:text-white 
                                                 ${activeItem === item.title ? 'bg-gray-900 text-white' : ''}`}
                                        onClick={() => handleItemClick(item.title)}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub className="bg-white shadow-xl rounded-b-xl p-4 space-y-2 mb-4 mx-0 border-none">
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild className="bg-slate-200 font-extralight p-4">
                                                    <Link href={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}