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
    )
}