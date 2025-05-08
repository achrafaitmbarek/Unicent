import Image from "next/image"
import { PencilLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import avatar from "@/assets/avatars/Erick.png"

const Profile = () => {
    return (
        <div className="container">
            <h1 className="text-2xl font-bold text-[#01254b] mb-6">My profile</h1>

            <div className="flex items-center gap-6 mb-10 bg-white p-6">
                <div className="h-24 w-24 rounded-full overflow-hidden">
                    <Image src={avatar} alt="John Doe" width={96} height={96} className="h-full w-full object-cover" />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-1">John Doe</h2>
                    <div className="text-sm text-[#8f939f] mb-1">Free plan</div>
                    <div className="text-base text-[#8f939f]">Welcome Back !</div>
                </div>

                <div className="ml-auto">
                    <Button className="bg-[#01254b] hover:bg-[#011c38] text-white px-6">Upgrade Plan</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-[#e9ebf2] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        <Button variant="ghost" size="sm" className="text-[#8f939f] hover:text-[#01254b] p-0">
                            <PencilLine className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                    </div>

                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm text-[#8f939f] mb-1">Full Name</label>
                            <div className="text-base">John Doe</div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex-1">
                                <label className="block text-sm text-[#8f939f] mb-1">Email</label>
                                <div className="text-base">JohnDoe@gmail.com</div>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm text-[#8f939f] mb-1">Next Invoice</label>
                                <div className="text-base">12/10/2024</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-[#8f939f] mb-1">Payment Method</label>
                            <div className="text-base">Credit Card/PayPal etc.</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-[#e9ebf2] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">AI Settings</h3>
                        <Button variant="ghost" size="sm" className="text-[#8f939f] hover:text-[#01254b] p-0">
                            <PencilLine className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                    </div>

                    <div className="mb-6">
                        <p className="text-[#8f939f]">Customize your AI insights and notifications</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-3">Preferred Insight Types</label>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 bg-[#f5f6f7] rounded-md text-sm">Savings</button>
                                <button className="px-4 py-1.5 bg-[#f5f6f7] rounded-md text-sm">Spending</button>
                                <button className="px-4 py-1.5 bg-[#f5f6f7] rounded-md text-sm">Investment</button>
                            </div>
                        </div>

                        <div>
                            <button className="px-4 py-1.5 bg-[#f5f6f7] rounded-md text-sm">Cash Flow</button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Report Type</label>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 bg-[#f5f6f7] rounded-md text-sm">Daily</button>
                                <button className="px-4 py-1.5 bg-[#f5f6f7] rounded-md text-sm">Weekly</button>
                                <button className="px-4 py-1.5 bg-[#f5f6f7] rounded-md text-sm">Monthly</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Profile;