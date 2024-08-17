'use client'
import { useForm } from "react-hook-form";
import AuthCard from "./auth-card";
import {zodResolver} from '@hookform/resolvers/zod'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { LoginSchema } from "@/types/LoginSchema";
import * as z from "zod"
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {useAction} from "next-safe-action/hooks"
import { LoginAction } from "@/server/actions/email-signin";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
  

export default function LoginForm(){
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })
    const {execute, status} = useAction(LoginAction, {
        onSuccess: ({data}) => {
            if(data?.success){
                setSuccess(data.success)
            }
            if(data?.error){
                setError(data.error)
            }
            if(data?.twoFactorToken){
                setShowTwoFactor(true)
            }
        }
    })
    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        execute(values)
    }
    return (
        <AuthCard 
            cardTitle="Welcome Back!"
            backButtonText="Create an account"
            backButtonHref="/auth/register"
            showSocials
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {showTwoFactor ? (
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>We have sent a 6 digit code to your email.</FormLabel>
                                <FormControl>
                                    <InputOTP
                                        disabled={status === "executing"}
                                        {...field}
                                        maxLength={6}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <> 
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            type="email"
                                            placeholder="myemail@gmail.com"
                                            autoComplete="email"
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            type="password"
                                            placeholder="********"
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button asChild size={'sm'} variant={'link'}>
                        <Link href='/auth/reset'>Forgot your password?</Link>
                    </Button>
                    <Button type="submit" className={cn('w-full', status === 'executing' ? 'animate-pulse': '')}>
                        {showTwoFactor? "Verify" : "Login"}
                    </Button>
                </form>
            </Form>
        </AuthCard>
    )
}