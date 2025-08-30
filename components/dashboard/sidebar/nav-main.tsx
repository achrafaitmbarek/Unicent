"use client"
import { ChevronDown, type LucideIcon } from "lucide-react"
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
            <SidebarMenu className="text-[#64748b] space-y-1 text-base px-1">
                {items.map((item) => {
                    if (!item.items?.length) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    size={"lg"}
                                    asChild
                                    tooltip={item.title}
                                    className={`rounded-md active:bg-none text-base font-normal transition-colors ${activeItem === item.title ? 'bg-[#01162c] text-white' : 'hover:bg-[#f8f8fb]'}`}
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
                                        size={"lg"}
                                        tooltip={item.title}
                                        className={`rounded-md active:bg-none text-base font-normal transition-colors ${activeItem === item.title ? 'bg-[#01162c] text-white' : 'hover:bg-[#f8f8fb]'}`}
                                        onClick={() => handleItemClick(item.title)}
                                    >
                                        <div className="flex items-center gap-4 justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                {item.icon && (
                                                    <span className={`flex items-center justify-center h-5 w-5 ${activeItem === item.title ? 'text-white' : 'text-[#64748b]'}`}>
                                                        <item.icon className="h-5 w-5" />
                                                    </span>
                                                )}
                                                <span>{item.title}</span>
                                            </div>
                                            <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openItems[item.title] ? 'rotate-180' : ''}`} />
                                        </div>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-1">
                                    <SidebarMenuSub className="py-6 border-none shadow-xl rounded-lg mx-0">
                                        {item.items?.map((subItem) => {
                                            const isSubItemActive = pathname === subItem.url;
                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className={`rounded-md transition-colors text-base font-medium
                                                         ${isSubItemActive
                                                                ? 'bg-[#f2f4fa] text-[#01162c]'
                                                                : 'text-[#64748b] hover:bg-[#f8f8fb]'}`}
                                                    >
                                                        <Link href={subItem.url} className="flex items-center py-6 relative pl-10 ">
                                                            <div className={`absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${isSubItemActive ? 'bg-[#01162c]' : 'bg-transparent'}`}>
                                                            </div>
                                                            <span className="block font-semibold">{subItem.title}</span>
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