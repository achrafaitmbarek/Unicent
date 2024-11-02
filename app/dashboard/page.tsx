import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DashboardPage = async () => {
    const session = await auth();

    if (!session?.user?.email) {
        return <h1>Access Denied</h1>;
    }

    // Fetch user data from the database
    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email }
    });

    if (!user) {
        return <h1>User not found</h1>;
    }

    return (
        <div>
            <h1>Welcome</h1>
            <p>Email: </p>
        </div>
    );
}

export default DashboardPage;