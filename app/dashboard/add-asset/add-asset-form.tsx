'use client'
import { AssetSchema } from "@/types/asset-schema"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DollarSign } from "lucide-react"
import Tiptap from "./tiptap"
import {zodResolver} from '@hookform/resolvers/zod'
import { useAction } from "next-safe-action/hooks"
import { CreateAsset } from "@/server/actions/create-asset"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Session } from "next-auth"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getAsset } from "@/server/actions/get-asset"
import { useEffect } from "react"
  

export default function AddAssetForm({
    session
}: {session: Session}){

    const router = useRouter()
    const searchParams = useSearchParams()
    const editMode = searchParams.get('id')
    const form = useForm<z.infer<typeof AssetSchema>>({
        resolver: zodResolver(AssetSchema),
        defaultValues: {
            title: '',
            description: '',
            type: 'rent',
            price: 0,
            owner: session.user.id,
            rentType: 'night'
        }
    })

    const fillFormIfEditMode = async (id: number) => {
        if(editMode){
            const data = await getAsset({id})
            if(data.error){
                toast.error(data.error)
                router.push('/dashboard/assets')
                return
            }
            if(data.success){
                form.setValue('id', data.success.id)
                form.setValue('title', data.success.title)
                form.setValue('description', data.success.description)
                form.setValue('owner', data.success.owner)
                form.setValue('type', data.success.type)
                form.setValue('price', data.success.price)
                form.setValue('rentType', data.success.rentType)
            }
        }
    }

    useEffect(() => {
        if(editMode){
            fillFormIfEditMode(parseInt(editMode))
        }
    }, [editMode])

    const {status, execute} = useAction(CreateAsset, {
        onSuccess: ({data}) => {
            if(data?.success){
                router.push('/dashboard/assets')
                toast.success(data.success)
            }
            if(data?.error) toast.error(data.error)
        },
        onExecute: () => {
            if(editMode){
                toast.loading('Updating asset...')
            }else{
                toast.loading('Creating asset...')
            }
        },
        onSettled: () => {
            toast.dismiss()
        }
    })

    const onSubmit = (values: z.infer<typeof AssetSchema>) => {
        execute(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{editMode ? "Edit Asset" : "Create Asset"}</CardTitle>
                <CardDescription>
                    {editMode ? "Update your existing assets." : "Create a new asset."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Asset Title</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="3 bedroom apartment"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Asset Description</FormLabel>
                                <FormControl>
                                    <Tiptap val={field.value} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Asset Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    defaultValue={field.value as string | undefined}
                                    defaultChecked={true}
                                    onValueChange={field.onChange}
                                    className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="rent" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Rent
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="sell" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Sell
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Asset Price</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={34} className="p-2 bg-muted rounded-md" />
                                        <Input
                                            type="number"
                                            placeholder="price in birr"
                                            step="1.0"
                                            {...field}
                                        />
                                        {form.getValues("type") === "rent" && (
                                            <FormField
                                                control={form.control}
                                                name="rentType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormControl>
                                                        <Select defaultValue={field.value as string | undefined} onValueChange={field.onChange}>
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Per" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="night">Nightly</SelectItem>
                                                                <SelectItem value="week">Weekly</SelectItem>
                                                                <SelectItem value="month">Monthly</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}  
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit"
                            disabled={
                                status === 'executing' ||
                                !form.formState.isValid ||
                                !form.formState.isDirty
                            }
                        >
                            {editMode ? "Save Changes" : "Add Asset"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}