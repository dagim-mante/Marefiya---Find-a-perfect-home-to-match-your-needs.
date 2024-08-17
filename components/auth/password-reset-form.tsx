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
import { useState, useEffect } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { PasswordResetSchema } from "@/types/PasswordResetSchema";
import { PasswordResetAction } from "@/server/actions/password-reset";
import { useSearchParams } from "next/navigation";

export default function PasswordResetForm(){
    const form = useForm<z.infer<typeof PasswordResetSchema>>({
        resolver: zodResolver(PasswordResetSchema),
        defaultValues: {
          password: "",
        },
      })
    
      const searchParams = useSearchParams()
      const token = searchParams.get("token")
    
      const [error, setError] = useState("")
      const [success, setSuccess] = useState("")
    
      const { execute, status } = useAction(PasswordResetAction, {
        onSuccess({data}) {
          if (data?.error) setError(data.error)
          if (data?.success) {
            setSuccess(data.success)
          }
        },
      })
    
      const onSubmit = (values: z.infer<typeof PasswordResetSchema>) => {
        execute({ password: values.password, token })
      }
    
      return (
        <AuthCard
          cardTitle="Enter a new password"
          backButtonHref="/auth/login"
          backButtonText="Back to login"
          showSocials
        >
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="*********"
                            type="password"
                            disabled={status === "executing"}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormSuccess message={success} />
                  <FormError message={error} />
                  <Button size={"sm"} variant={"link"} asChild>
                    <Link href="/auth/reset">Forgot your password</Link>
                  </Button>
                </div>
                <Button
                  type="submit"
                  className={cn(
                    "w-full",
                    status === "executing" ? "animate-pulse" : ""
                  )}
                >
                  Reset Password
                </Button>
              </form>
            </Form>
          </div>
        </AuthCard>
      )
}