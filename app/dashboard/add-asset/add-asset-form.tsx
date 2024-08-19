'use client'
import { AssetSchema } from "@/types/asset-schema"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DollarSign } from "lucide-react"
  

export default function AddAssetForm(){
    const form = useForm<z.infer<typeof AssetSchema>>({
        defaultValues: {
            title: '',
            description: '',
            type: 'rent',
            price: 0
        }
    })
    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={() => console.log('hi')} className="space-y-8">
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
                                    {/* <Input 
                                        placeholder="3 bedroom apartment"
                                        {...field}
                                    /> */}
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
                                    defaultValue={field.value}
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
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}