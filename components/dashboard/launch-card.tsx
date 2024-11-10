import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import launchIcon from "@/assets/launch-icon.png"
import Image from "next/image"

export default function LaunchCard() {
    return (
        <Card className="relative flex flex-col bg-slate-900 pt-12  mx-6">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <Image
                    src={launchIcon}
                    alt="Launch"
                    width={80}
                    height={80}
                />
            </div>
            <CardFooter className="flex flex-col space-y-2 justify-end items-center py-4 px-4">
                <CardDescription className="text-sm text-white text-center">Level Up Your Finances with AI Superpowers! </CardDescription>
                <Button variant="outline" className="bg-[#E6ECF2]">Upgrade Now !</Button>
            </CardFooter>
        </Card>
    )
}
