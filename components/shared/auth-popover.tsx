import React from 'react';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import bankLogo from "@/assets/Bank.png";
import wallet from "@/assets/walletLogo.png";

type AuthPopoverProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    status: 'waiting' | 'completed';
    bankName?: string;
};

export const AuthPopover = ({
    isOpen,
    onOpenChange,
    status,
    bankName = "",
}: AuthPopoverProps) => {
    const isWaiting = status === 'waiting';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-none">
                <div className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="relative w-36 h-36 mb-4">
                        <Image
                            src={isWaiting ? bankLogo : wallet}
                            alt={isWaiting ? "Bank illustration" : "Wallet illustration"}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <h2 className="text-2xl font-medium text-nav-text-active mb-1">
                        {isWaiting ? "Waiting for Auth" : "Authentication Completed"}
                    </h2>

                    <p className="text-sm text-gray-500 mb-6">
                        {isWaiting
                            ? `waiting for ${bankName || "___"}`
                            : `You have successfully authenticated`
                        }
                    </p>

                    <Button
                        disabled
                        className={`w-full text-white rounded py-3 ${isWaiting
                            ? "bg-nav-dark-active"
                            : "bg-nav-normal-active"
                            }`}
                    >
                        {isWaiting ? "Synchronisation in process ...." : "Redirection ..."}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};