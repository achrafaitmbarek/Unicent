
import { Input } from "@/components/ui/input";
import { LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import avatar from "@/assets/avatars/Erick.png";
import { auth, signOut } from "@/auth";


type Props = {};

export const NavBar = async ({ }: Props) => {
    const session = await auth();
    return (
        <div className="bg-white w-full px-8 py-3 flex flex-row justify-between items-center border-b">
            <div>
                {/* <Input
                    type="search"
                    placeholder="Search here"
                    className="h-10 min-w-60"
                /> */}
            </div>
            <div className="flex items-center space-x-8">
                <Button variant={'default'} className="py-5 px-6 text-sm rounded-lg" onClick={async () => {
                    "use server"
                    await signOut();
                }}>Logout
                    <LogOut className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-4">
                    <span className="p-1 border border-gray-200 rounded-lg">
                        <Bell className="h-6 w-6 text-gray-500" />
                    </span>
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={avatar.src} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                        <span className="text-gray-900 font-semibold text-sm">{session?.user?.name}</span>
                        <span className="text-gray-600 text-sm">{session?.user?.email}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};