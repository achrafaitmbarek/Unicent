import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar"
import { NavBar } from "@/components/dashboard/nav-bar";
import { auth } from "@/auth";
import { Toaster } from "sonner"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user?.email) {
        return <h1>Access Denied</h1>;
    }
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full bg-[#f2f4fa]">
                <NavBar />
                <SidebarTrigger />
                {children}
            </main>
            <Toaster />
        </SidebarProvider>
    );
}