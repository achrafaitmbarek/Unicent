import { Card, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
    return (
        <div className="container animate-pulse">
            <div>
                <div className="h-8 w-40 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border border-[#eaecf0]">
                        <CardContent className="p-6">
                            <div className="flex justify-between">
                                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                                <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="h-4 w-24 bg-gray-200 rounded mt-3"></div>
                            <div className="h-7 w-32 bg-gray-200 rounded mt-2"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-[#eaecf0]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                            <div className="h-5 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-8 w-32 bg-gray-200 rounded mb-3"></div>
                        <div className="h-[250px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="h-[200px] w-[90%] bg-gray-200 rounded relative">
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-100 to-transparent rounded-b-lg"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-[#eaecf0]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                            <div className="h-5 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-[250px] flex items-center justify-center">
                            <div className="h-48 w-48 rounded-full bg-gray-200 relative">
                                <div className="absolute inset-4 rounded-full bg-white"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="col-span-1 lg:col-span-8">
                    <Card className="border border-[#eaecf0] h-full">
                        <CardContent className="p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                                <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
                            </div>

                            <div className="flex-1">
                                <div className="grid grid-cols-4 gap-4 py-3 bg-gray-50 rounded-t px-4">
                                    <div className="h-5 w-24 bg-gray-200 rounded col-span-1"></div>
                                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                                    <div className="h-5 w-16 bg-gray-200 rounded justify-self-end"></div>
                                </div>

                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="grid grid-cols-4 gap-4 py-4 border-b px-4">
                                        <div className="col-span-1">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                                                <div className="h-5 w-full bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="h-5 w-24 bg-gray-200 rounded self-center"></div>
                                        <div className="h-6 w-16 bg-gray-200 rounded-full self-center"></div>
                                        <div className="h-5 w-20 bg-gray-200 rounded justify-self-end self-center"></div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-1 lg:col-span-4">
                    <Card className="border border-[#eaecf0] h-full">
                        <CardContent className="p-6 h-full flex flex-col items-center justify-center">
                            <div className="h-32 w-32 rounded-full bg-gray-200 mb-4"></div>
                            <div className="h-7 w-32 bg-gray-200 rounded mb-3"></div>
                            <div className="h-16 w-full bg-gray-200 rounded mb-6"></div>
                            <div className="w-full h-10 bg-gray-200 rounded mt-auto"></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}