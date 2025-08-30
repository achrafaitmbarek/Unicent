import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,

} from "@/components/ui/card"

import launchIcon from "@/assets/launch-icon.png"
import Image from "next/image"

type Props = { variant?: "default" | "compact" }

export default function LaunchCard({ variant = "default" }: Props) {
    if (variant === "compact") {
        return (
            <Card className="relative flex flex-col items-center justify-center bg-slate-900 p-3">
                <Image src={launchIcon} alt="Launch" width={36} height={36} />
            </Card>
        )
    }

    return (
        <Card className="relative flex flex-col bg-slate-900 pt-12">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <Image src={launchIcon} alt="Launch" width={80} height={80} />
            </div>
            <CardFooter className="flex flex-col space-y-2 justify-end items-center py-4 px-4">
                <CardDescription className="text-sm text-white text-center">Level Up Your Finances with AI Superpowers! </CardDescription>
                <Button variant="outline" className="bg-[#E6ECF2]">Upgrade Now !</Button>
            </CardFooter>
        </Card>
    )
}
