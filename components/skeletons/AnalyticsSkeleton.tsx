export default function SkeletonAnalytics() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-5">
                        <div className="h-7 w-36 bg-gray-200 rounded"></div>
                        <div className="h-8 w-36 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-28 bg-gray-200 rounded"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-48 w-full relative">
                        <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between items-end">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-3 w-8 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                        <div className="absolute bottom-0 left-10 right-0 flex justify-between">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-3 w-8 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                        <div className="absolute left-12 right-2 top-1/3 h-28">
                            <div className="h-1 w-full bg-gray-200 rounded-full transform rotate-2"></div>
                            <div className="absolute top-1/2 right-12 h-10 w-10 rounded-full bg-gray-300 border-4 border-white"></div>
                            <div className="absolute bottom-0 left-12 right-12 h-12 bg-gradient-to-b from-gray-200/50 to-transparent rounded-b-lg"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                    <div className="relative h-48 w-48 mx-auto">
                        <div className="h-full w-full rounded-full bg-gray-200"></div>
                        <div className="absolute inset-4 rounded-full bg-white"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="h-6 w-24 bg-gray-200 rounded mx-auto mb-1"></div>
                            <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-3">
                <div className="flex justify-between items-center mb-4 px-6 py-2">
                    <div className="h-8 w-56 bg-gray-200 rounded"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="overflow-hidden">
                    <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 rounded-t-lg">
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded ml-auto"></div>
                    </div>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="grid grid-cols-5 gap-4 px-6 py-4 border-b">
                            <div className="h-5 w-20 bg-gray-200 rounded"></div>
                            <div className="h-5 w-full bg-gray-200 rounded"></div>
                            <div className="h-5 w-24 bg-gray-200 rounded"></div>
                            <div className="h-5 w-16 bg-gray-200 rounded"></div>
                            <div className="h-5 w-16 bg-gray-200 rounded ml-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}