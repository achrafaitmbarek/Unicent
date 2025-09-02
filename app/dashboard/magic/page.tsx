import { auth } from "@/auth";
import MagicClient from "./ui/magic-client";

export default async function MagicPage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Access denied</div>;
    return <MagicClient />;
}
