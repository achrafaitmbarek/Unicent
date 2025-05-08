"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import SirenIcon from "@/assets/tips-Cards/SirenIcon.png";
import { Button } from "../ui/button";

type Recommendation = {
    id: string;
    title: string;
    description: string;
    subdescription?: string | null;
    priority: string;
};

export function PersonalizedTip({ recommendations }: { recommendations: Recommendation[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleDislike = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendations.length);
    };

    // Handle empty recommendations
    if (recommendations.length === 0) {
        return <div className="text-sm text-[#8993a4]">No recommendations available</div>;
    }

    const currentTip = recommendations[currentIndex];

    return (
        <div className="rounded-lg border border-[#e6ecf2] bg-white p-5 h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#01162c]">Today AI Personalized Tip</h2>
                <Button variant={"ghost"} className="rounded-full p-1 text-[#8993a4] hover:bg-[#f2f4fa]">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex gap-4 flex-1">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ">
                    <Image
                        src={SirenIcon}
                        alt="AI Icon"
                        width={52}
                        height={52}
                        className="h-12 w-12"
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <p className="font-bold text-primary">
                        {currentTip.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                        {currentTip.subdescription}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
                <Button variant={"ghost"} className="rounded-full p-1 text-[#8993a4] hover:bg-[#f2f4fa]">
                    <ThumbsUp className="h-5 w-5" />
                </Button>
                <Button variant={"ghost"}
                    onClick={handleDislike}
                    className="rounded-full p-1 text-[#8993a4] hover:bg-[#f2f4fa]"
                >
                    <ThumbsDown className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}