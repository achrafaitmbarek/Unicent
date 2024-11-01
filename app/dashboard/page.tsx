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
            {user.role === "ADMIN" ? <h1>Hello in Admin Dashboard</h1> : <h1>Hello in Agent Dashboard</h1>}
            <p>User Role: {user.role}</p>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <pre>{JSON.stringify(user, null, 4)}</pre> {/* Display fetched user data */}
            <p>{user.role}</p>
        </div>
    );
}

export default DashboardPage;