"use client";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { AuthPopover } from "./auth-popover";
import { initiateConnection } from "@/services/actions/bank-actions";


const BankCard = ({ name, logo }: { name: string; logo: StaticImageData | string }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleBankClick = async () => {
        setIsPopoverOpen(true);

        try {
            const connectUrl = await initiateConnection();

            setTimeout(() => {
                window.location.href = connectUrl;
            }, 1500);
        } catch (error) {
            console.error("Failed to connect to bank:", error);
            setTimeout(() => {
                setIsPopoverOpen(false);
            }, 1500);
        }
    };

    return (
        <>
            <div
                className="bg-white rounded-lg shadow-md p-16 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={handleBankClick}
            >
                <div className="h-16 w-16 relative mb-4">
                    <Image
                        src={logo}
                        alt={`${name} logo`}
                        fill
                        className="object-contain"
                    />
                </div>
                <h3 className="font-medium text-gray-800">{name}</h3>
            </div>

            <AuthPopover
                isOpen={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                status="waiting"
                bankName={name}
            />
        </>
    );
};

export default BankCard;