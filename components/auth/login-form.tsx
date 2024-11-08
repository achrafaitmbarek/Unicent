"use client"
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState, useTransition } from "react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { handleGoogleSignIn, login } from "@/services/actions/login";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";


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
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
        }
    })
    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        setIsRedirecting(false);

        startTransition(() => {
            login(values)
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
    }

    const onGoogleClick = async () => {
        try {
            setIsGoogleLoading(true);
            setError("");
            await handleGoogleSignIn();
        } catch (error) {
            console.error("Error during Google sign in:", error);
            setError("An error occurred with Google sign in");
        } finally {
            setIsGoogleLoading(false);
        }
    };
    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <div className="flex flex-col items-center mb-2 space-y-1">
                <h1 className="text-3xl font-bold mb-4">Login To Your Account</h1>
                <p className="text-gray-500">Enter your email below to login</p>
            </div>
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
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button type="submit" size={"lg"}
                        disabled={isPending || !!success || isRedirecting}
                        className="w-full font-semibold flex items-center justify-center">
                        {(isPending || isRedirecting) && (
                            <div className="spinner mr-2"></div>
                        )}
                        {isPending ? "Loading..." : isRedirecting ? "Redirecting..." : "Sign In"}
                    </Button>
                </form>
            </Form>

            <div className="flex items-center w-1/2 px-1 py-4">
                <div className="flex-grow border-t border-gray-400" />
                <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-gray-400" />
            </div>
            <Button
                onClick={onGoogleClick}
                disabled={isGoogleLoading || !!success || isRedirecting}
                variant="outline"
                className="w-1/2 flex items-center justify-center font-semibold"
                size="lg"
            >
                {(isGoogleLoading) && (
                    <div className="spinner mr-2"></div>
                )}
                {!isGoogleLoading && <FcGoogle style={{ width: '1.5rem', height: '1.5rem' }} />}
                {isGoogleLoading ? "Loading..." : "Gmail"}
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

export const LoginForm = () => {
    return (
        <Suspense fallback={<div className="w-full flex justify-center">
            <div className="spinner"></div>
        </div>}>
            <RegisterFormContent />
        </Suspense>
    )
}