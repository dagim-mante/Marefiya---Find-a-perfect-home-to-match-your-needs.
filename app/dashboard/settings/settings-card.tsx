'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SettingsSchema } from "@/types/settings-schema"
import { Session } from "next-auth"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import FormError from "@/components/auth/form-error"
import FormSuccess from "@/components/auth/form-success"
import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { UpdateSettings } from "@/server/actions/settings"
import {UploadButton} from "@/lib/uploadthing"

type SettingsTypes = {
    session: Session
}

export default function SettingsCard(session: SettingsTypes){
    const {session:extractedSession} = session
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [avatarUploading, setAvatarUploading] = useState(false)

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
          name: extractedSession?.user?.name || undefined,
          email: extractedSession?.user?.email || undefined,
          image: extractedSession?.user?.image || undefined,
          password: undefined,
          newPassword: undefined,
          isTwoFactorEnabled: extractedSession?.user?.isTwoFactorEnabled || undefined,
          bio: extractedSession?.user.bio || undefined 
        },
    })

    const {status, execute} = useAction(UpdateSettings, {
        onSuccess: async ({data}) => {
            if(data?.error) setError(data.error)
            if(data?.success) setSuccess(data.success)
        }
    })

    const onSubmit = (values: z.infer <typeof SettingsSchema>) => {
        execute(values)
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Change your settings</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="John Doe"
                                        disabled={status === 'executing'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Avatar</FormLabel>
                                <div className='flex items-center gap-4'>
                                    {!form.getValues('image') ? (
                                        <div className='font-bold'>
                                            {extractedSession.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <Image 
                                            src={form.getValues('image')!}
                                            alt='User Avatar'
                                            width={42}
                                            height={42}
                                            className='rounded-full'
                                        />
                                    )} 
                                    <UploadButton
                                        className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                                        endpoint="avatarUploader"
                                        onUploadBegin={() => {
                                            setAvatarUploading(true)
                                        }}
                                        onUploadError={(error) => {
                                            form.setError('image', {
                                                message: error.message
                                            })
                                            setAvatarUploading(false)
                                            return
                                        }}
                                        onClientUploadComplete={(res) => {
                                            setAvatarUploading(false)
                                            form.setValue('image', res[0].url)
                                            return
                                        }}
                                        content={{button({ready}){
                                                if(ready){
                                                    return <div>Change Avatar</div>
                                                }
                                                return <div>Loading...</div>
                                            }
                                        }}
                                    />
                                </div>
                                <FormControl>
                                    <Input 
                                        placeholder="User Image"
                                        disabled={status === 'executing'}
                                        {...field}
                                        type='hidden'
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        {extractedSession.user.role === 'owner' ? (
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Your information here"
                                            disabled={status === 'executing'}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your bio, displayed below your name.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                            )}
                            />
                        ) : null}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="********"
                                        disabled={status === 'executing' || extractedSession.user.isOAuth}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="********"
                                        disabled={status === 'executing' || extractedSession.user.isOAuth}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Two Factor Authentication</FormLabel>
                                <FormDescription>
                                    Enable two factor authentication for your account.
                                </FormDescription>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={status === 'executing' || extractedSession.user.isOAuth}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                        )}
                        />
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button 
                            type="submit"
                            disabled={status === "executing" || avatarUploading}
                        >
                            Update Settings
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}