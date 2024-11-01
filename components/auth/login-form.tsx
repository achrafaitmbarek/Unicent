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

import Logo from '@/assets/Algarve.png'

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
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A0A0A]">
                <p className="text-gray-300 text-4xl mb-2">Welcome to LuxeHome Admin Login</p>
                <p className="text-[#344345] text-xl">Please sign in to manage your LuxeHome spaces</p>
            </div>
            <div className="w-full h-full flex flex-col">
                <div className="flex justify-between items-center p-4">
                    <Image src={Logo} alt="LuxeHome Logo" height={70} />
                    <Button variant="default">Contact Support</Button>
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
                            <Button type="submit"
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