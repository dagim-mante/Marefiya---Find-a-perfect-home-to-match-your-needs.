'use client'
import { useForm } from "react-hook-form";
import AuthCard from "./auth-card";
import {zodResolver} from '@hookform/resolvers/zod'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import * as z from "zod"
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {useAction} from "next-safe-action/hooks"
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { RequestPasswordResetSchema } from "@/types/RequestPasswordResetSchema";
import { RequestPasswordResetAction } from "@/server/actions/request-password-reset";

export default function RequestPasswordResetForm(){
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const form = useForm<z.infer <typeof RequestPasswordResetSchema>>({
        resolver: zodResolver(RequestPasswordResetSchema),
        defaultValues: {
            email: '',
        }
    })
    const {execute, status} = useAction(RequestPasswordResetAction, {
        onSuccess: ({data}) => {
            if(data?.success){
                setSuccess(data.success)
            }
            if(data?.error){
                setError(data.error)
            }
        }
    })
    const onSubmit = (values: z.infer<typeof RequestPasswordResetSchema>) => {
        execute(values)
    }
    return (
        <AuthCard 
            cardTitle="Forgot your password?"
            backButtonText="Back to login"
            backButtonHref="/auth/login"
            showSocials
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button asChild size={'sm'} variant={'link'}>
                        <Link href='/auth/reset'>Forgot your password?</Link>
                    </Button>
                    <Button type="submit" className={cn('w-full', status === 'executing' ? 'animate-pulse': '')}>
                        Reset Password
                    </Button>
                </form>
            </Form>
        </AuthCard>
    )
}