import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar"
import { NavBar } from "@/components/dashboard/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full bg-[#FAFAFA]">
                <NavBar />
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}