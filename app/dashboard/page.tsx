import { auth } from "@/auth";

const DashboardPage = async () => {
    const session = await auth();

    if (!session?.user?.email) {
        return <h1>Access Denied</h1>;
    }


    return (
        <div>
            <h1>Welcome</h1>
            <p>Email: {session?.user?.email} </p>
            <p>Name:{session?.user?.name}</p>
        </div>
    );
}

export default DashboardPage;