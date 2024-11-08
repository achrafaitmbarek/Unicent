"use client"
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState, useTransition } from "react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { register, handleGoogleSignIn } from "@/services/actions/register";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { FcGoogle } from "react-icons/fc";
import { useRouter, useSearchParams } from "next/navigation";


const RegisterFormContent = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Your account is not linked with Google. Please sign in with Email"
        : ""

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            name: ""
        }
    })
    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");
        setIsRedirecting(false);

        startTransition(() => {
            register(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                        if (data.redirect) {
                            setIsRedirecting(true);
                            setTimeout(() => {
                                router.push(data.redirect);
                            }, 2000); // Redirect after 2 seconds
                        }
                    } else if (data.success) {
                        setSuccess(data.success);
                    }
                })
        })
    };

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <div className="flex flex-col items-center mb-2 space-y-1">
                <h1 className="text-3xl font-bold mb-4">Create an account</h1>
                <p className="text-gray-500">Enter your name and email below to create an account</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 w-1/2">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            placeholder="John Doe"
                                            disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
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
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button type="submit" size={"lg"}
                        disabled={isPending || !!success || isRedirecting}
                        className="w-full font-semibold flex items-center justify-center">
                        {(isPending || isRedirecting) && (
                            <div className="spinner mr-2"></div>
                        )}
                        {isPending ? "Loading..." : isRedirecting ? "Redirecting..." : "  Sign Up With Email"}
                    </Button>
                </form>
            </Form>
            <div className="flex items-center w-1/2 px-1 py-4">
                <div className="flex-grow border-t border-gray-400" />
                <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-gray-400" />
            </div>
            <Button onClick={() => {
                handleGoogleSignIn()
            }} disabled={isPending || !!success || isRedirecting} variant="outline" className="w-1/2 flex items-center justify-center font-semibold" size={"lg"}>
                <FcGoogle style={{ width: '1.5rem', height: '1.5rem' }} />
                Gmail
            </Button>

            <div className="text-gray-500 text-center">
                <p className="text-sm max-w-xs">
                    By clicking continue, you agree to our{' '}
                    <a href="#" className="text-gray-600 underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-gray-600 underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    )
}

export const RegisterForm = () => {
    return (
        <Suspense fallback={<div className="w-full flex justify-center">
            <div className="spinner"></div>
        </div>}>
            <RegisterFormContent />
        </Suspense>
    )
}