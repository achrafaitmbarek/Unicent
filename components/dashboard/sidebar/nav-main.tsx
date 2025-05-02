"use client"
import { ChevronDown, type LucideIcon, BrainCircuit } from "lucide-react"
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
import { useState, useEffect } from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    const pathname = usePathname();

    useEffect(() => {
        let foundMatch = false;

        items.forEach(item => {
            if (item.url === pathname) {
                setActiveItem(item.title);
                foundMatch = true;
            }

            if (!foundMatch && item.items?.some(subItem => subItem.url === pathname)) {
                setActiveItem(item.title);
                setOpenItems(prev => ({
                    ...prev,
                    [item.title]: true
                }));
                foundMatch = true;
            }
        });
    }, [pathname, items]);

    const handleItemClick = (title: string) => {
        setActiveItem(title);

        if (items.find(item => item.title === title && item.items?.length)) {
            setOpenItems(prev => ({
                ...prev,
                [title]: !prev[title]
            }));
        }
    };

    return (
        <SidebarGroup>
            <SidebarMenu className="text-[#64748b] space-y-1 text-base px-4">
                {items.map((item) => {
                    if (!item.items?.length) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    size={'lg'}
                                    asChild
                                    tooltip={item.title}
                                    className={`px-3 py-2 rounded-md active:bg-none text-base font-normal transition-colors
                                    ${activeItem === item.title ? 'bg-[#01162c] text-white' : 'hover:bg-[#f8f8fb]'}`}
                                    onClick={() => handleItemClick(item.title)}
                                >
                                    <Link href={item.url} className="flex items-center gap-3">
                                        {item.icon && <item.icon className="h-5 w-5" />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            open={openItems[item.title] || false}
                            onOpenChange={(isOpen) => {
                                setOpenItems(prev => ({
                                    ...prev,
                                    [item.title]: isOpen
                                }));
                            }}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        className={`px-3 py-2 rounded-md active:bg-none text-base font-normal transition-colors
                                        ${activeItem === item.title ? 'bg-[#01162c] text-white' : 'hover:bg-[#f8f8fb]'}`}
                                        onClick={() => handleItemClick(item.title)}
                                    >
                                        <div className="flex items-center gap-3 justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                {item.icon && (
                                                    <span className="flex items-center justify-center h-5 w-5 text-white">
                                                        <BrainCircuit className="h-5 w-5" />
                                                    </span>
                                                )}
                                                <span>{item.title}</span>
                                            </div>
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openItems[item.title] ? 'rotate-180' : ''}`} />
                                        </div>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-1">
                                    <SidebarMenuSub className=" py-6 space-y-4 border-none shadow-xl rounded-lg mx-0">
                                        {item.items?.map((subItem) => {
                                            const isSubItemActive = pathname === subItem.url;
                                            return (
                                                <SidebarMenuSubItem key={subItem.title} className="">
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className={`rounded-md transition-colors text-base
                                                         ${isSubItemActive
                                                                ? 'bg-[#f2f4fa] text-[#01162c]'
                                                                : 'text-[#64748b] hover:bg-[#f8f8fb]'}`}
                                                    >
                                                        <Link href={subItem.url} className="flex items-center">
                                                            {isSubItemActive && (
                                                                <div className="h-2 w-2 bg-[#01162c] rounded-full mr-2"></div>
                                                            )}
                                                            <span className="block">{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
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