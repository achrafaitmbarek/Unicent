"use client"
import { ChevronDown, type LucideIcon, Wand2, Activity, Target, Wallet } from "lucide-react"
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
import { useSidebar } from "@/components/ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    const pathname = usePathname();
    const { state } = useSidebar();

    // Helpers to style AI Insights sublinks consistently
    const isAiInsights = (title: string) => title.toLowerCase() === 'ai insights';
    const aiAccent = (subTitle: string) => {
        const key = subTitle.toLowerCase();
        if (key.includes('magic')) return { dot: 'bg-purple-600', text: 'text-purple-700', bg: 'hover:bg-purple-50' };
        if (key.includes('financial watch')) return { dot: 'bg-amber-600', text: 'text-amber-700', bg: 'hover:bg-amber-50' };
        if (key.includes('saving') || key.includes('goal')) return { dot: 'bg-emerald-600', text: 'text-emerald-700', bg: 'hover:bg-emerald-50' };
        if (key.includes('smart budget') || key.includes('budget')) return { dot: 'bg-blue-600', text: 'text-blue-700', bg: 'hover:bg-blue-50' };
        return { dot: 'bg-gray-400', text: 'text-gray-700', bg: 'hover:bg-gray-50' };
    };
    const aiIcon = (subTitle: string) => {
        const key = subTitle.toLowerCase();
        if (key.includes('magic')) return <Wand2 className="h-4 w-4" />;
        if (key.includes('financial watch')) return <Activity className="h-4 w-4" />;
        if (key.includes('saving') || key.includes('goal')) return <Target className="h-4 w-4" />;
        if (key.includes('smart budget') || key.includes('budget')) return <Wallet className="h-4 w-4" />;
        return null;
    };

    useEffect(() => {
        // Open only the section that matches the current path; close others
        const next: Record<string, boolean> = {};
        for (const i of items) {
            if (i.items?.length) {
                const hasActiveChild = i.items.some(si => si.url === pathname);
                const isParentActive = pathname === i.url;
                next[i.title] = hasActiveChild || isParentActive;
            }
        }
        setOpenItems(next);
    }, [pathname, items]);

    return (
        <SidebarGroup>
            <SidebarMenu className="text-[#64748b] space-y-1 text-base px-1">
                {items.map((item) => {
                    if (!item.items?.length) {
                        const isActive = pathname === item.url;
                        const isCollapsed = state === 'collapsed';
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    size={"lg"}
                                    asChild
                                    tooltip={item.title}
                                    className={`rounded-md active:bg-none text-base font-normal transition-colors ${isActive ? 'bg-[#01162c] text-white' : 'hover:bg-[#f8f8fb]'}`}
                                >
                                    <Link href={item.url} className={`flex items-center ${isCollapsed ? 'justify-center gap-0 px-0' : 'gap-3'}`}>
                                        {item.icon && <item.icon className="h-5 w-5" />}
                                        {isCollapsed ? (
                                            <span className="sr-only">{item.title}</span>
                                        ) : (
                                            <span>{item.title}</span>
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }

                    const hasActiveChild = item.items?.some(sub => sub.url === pathname);
                    const isSectionActive = hasActiveChild || pathname === item.url;

                    // Collapsed: show icon only and a flyout with sublinks
                    if (state === 'collapsed') {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <SidebarMenuButton
                                            size={"lg"}
                                            tooltip={item.title}
                                            className={`rounded-md active:bg-none text-base font-normal transition-colors ${isSectionActive ? 'bg-[#01162c] text-white' : 'hover:bg-[#f8f8fb]'}`}
                                        >
                                            <div className="flex items-center justify-center gap-0 w-full px-0">
                                                {item.icon && <item.icon className="h-5 w-5" />}
                                                <span className="sr-only">{item.title}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </PopoverTrigger>
                                    <PopoverContent side="right" align="start" className="p-0 w-64">
                                        <SidebarMenuSub className="py-2 border-none rounded-lg mx-0">
                                            {item.items?.map((subItem) => {
                                                const isSubItemActive = pathname === subItem.url;
                                                const accents = isAiInsights(item.title) ? aiAccent(subItem.title) : undefined;
                                                return (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            className={`rounded-md transition-colors text-sm font-medium px-3 ${isSubItemActive ? 'bg-[#f2f4fa] text-[#01162c]' : 'text-[#64748b]'} ${accents ? accents.bg : 'hover:bg-[#f8f8fb]'}`}
                                                        >
                                                            <Link href={subItem.url} className="flex items-center py-3 gap-2">
                                                                {isAiInsights(item.title) && (
                                                                    <span className={`h-1.5 w-1.5 rounded-full ${accents?.dot}`} />
                                                                )}
                                                                {isAiInsights(item.title) && (
                                                                    <span className={`${accents?.text}`}>{aiIcon(subItem.title)}</span>
                                                                )}
                                                                <span className="block font-semibold">{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            })}
                                        </SidebarMenuSub>
                                    </PopoverContent>
                                </Popover>
                            </SidebarMenuItem>
                        )
                    }

                    // Expanded: traditional collapsible with labels
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
                                        className={`rounded-md active:bg-none text-base font-normal transition-colors ${isSectionActive ? 'bg-[#01162c] text-white' : 'hover:bg-[#f8f8fb]'}`}
                                    >
                                        <div className="flex items-center gap-4 justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                {item.icon && (
                                                    <span className={`flex items-center justify-center h-5 w-5 ${isSectionActive ? 'text-white' : 'text-[#64748b]'}`}>
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
                                            const accents = isAiInsights(item.title) ? aiAccent(subItem.title) : undefined;
                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className={`rounded-md transition-colors text-base font-medium ${isSubItemActive ? 'bg-[#f2f4fa] text-[#01162c]' : 'text-[#64748b]'} ${accents ? accents.bg : 'hover:bg-[#f8f8fb]'}`}
                                                    >
                                                        <Link href={subItem.url} className="flex items-center py-6 gap-3 pl-6">
                                                            {isAiInsights(item.title) ? (
                                                                <span className={`h-2 w-2 rounded-full ${accents?.dot}`} />
                                                            ) : (
                                                                <span className={`h-2 w-2 rounded-full ${isSubItemActive ? 'bg-[#01162c]' : 'bg-transparent'}`} />
                                                            )}
                                                            {isAiInsights(item.title) && (
                                                                <span className={`${accents?.text}`}>{aiIcon(subItem.title)}</span>
                                                            )}
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