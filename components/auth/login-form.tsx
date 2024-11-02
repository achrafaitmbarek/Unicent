"use client"
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { login } from "@/services/actions/login";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import Image from "next/image";

import Logo from '@/assets/Logo.png'
import LoginAvatar from '@/assets/Login_avatar.png'
import CointLogo from '@/assets/CointLogo.png'

export const LoginForm = () => {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
        }
    })
    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                })
        })
    }
    return (
        <div className="h-screen w-full mx-auto flex flex-row ">
            <div className="w-full h-full flex flex-col bg-[#01162C] p-8">
                {/* Top Section with Logo and Quote */}
                <div className="flex items-start gap-4 mb-20">
                    <Image
                        src={CointLogo}
                        alt="UC Wealth Logo"
                        width={50}
                        height={50}
                    />
                    <div className="flex flex-col">
                        <h1 className="text-white text-2xl font-semibold mb-3">
                            UC Wealth
                        </h1>
                        <p className="text-gray-300 text-sm max-w-md leading-relaxed">
                            {`"UC's AI-driven insights have revolutionized how I budget and save.
                    It's simple yet powerful - exactly what I needed."`}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Sofia Davis
                        </p>
                    </div>
                </div>

                {/* Center Image */}
                <div className="flex-1 flex items-center justify-center">
                    <Image
                        src={LoginAvatar}
                        alt="Login Avatar"
                        className="max-h-[600px] w-auto"
                        priority
                    />
                </div>
            </div>

            <div className="w-full h-full flex flex-col">
                <div className="flex justify-between items-center p-10">
                    <Image src={Logo} alt="LuxeHome Logo" height={40} />
                    <Button variant="default" size={"lg"}>Login</Button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6 w-1/2">
                            <div className="space-y-4">
                                <FormField control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    placeholder="john.doe@example.com"
                                                    disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <Button type="submit" size={"lg"}
                                disabled={isPending || !!success}>
                                {isPending ? "Loading..." : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

        </div>

    )
}