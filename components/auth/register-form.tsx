'use client'
import { useForm } from "react-hook-form";
import AuthCard from "./auth-card";
import {zodResolver} from '@hookform/resolvers/zod'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {RegisterSchema} from "@/types/RegisterSchema"
import * as z from "zod"
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {useAction} from "next-safe-action/hooks"
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RegisterAction } from "@/server/actions/email-register";
import FormSuccess from "./form-success";
import FormError from "./form-error";

export default function RegisterForm(){
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            name: ''
        }
    })

    const {execute, status} = useAction(RegisterAction, {
        onSuccess: ({ data }) => {
            console.log("DATA", data)
            if(data?.error){
                setError(data.error)
            }
            if(data?.success){
                console.log(success, 'SET')
                setSuccess(data.success)
                console.log(success)
            }
        },
        onSettled: ({result}) => {
            console.log(result)
        }
    })
    
    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        execute(values)
    }
    return (
        <AuthCard 
            cardTitle="Create an Account"
            backButtonText="Already have an account?"
            backButtonHref="/auth/login"
            showSocials
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        type="text"
                                        placeholder="joe"
                                    />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                                </FormItem>
                            )}
                        />
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
                    <FormError message={error}/>
                    <FormSuccess message={success} />
                    <Button asChild size={'sm'} variant={'link'}>
                        <Link href='/auth/reset'>Forgot your password?</Link>
                    </Button>
                    <Button type="submit" className={cn('w-full', status === 'executing' ? 'animate-pulse': '')}>
                        Register
                    </Button>
                </form>
            </Form>
        </AuthCard>
    )
}