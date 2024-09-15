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
import { DollarSign, MapPin } from "lucide-react"
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
import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
  
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?"

export default function AddAssetForm({
    session
}: {session: Session}){

    const [searchText, setSearchText] = useState("")
    const [placeList, setPlaceList] = useState([])
    const [selectedPosition, setSelectedPosition] = useState<number[] | null>(null)

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
            rentType: 'month',
            location: 'Piassa, Addis Ababa',
            latitude: 9.034459397466916,
            longitude: 38.752732794669676
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
                form.setValue('location', data.success.location)
                form.setValue('latitude', data.success.latitude)
                form.setValue('longitude', data.success.longitude)
                setSelectedPosition([data.success.latitude, data.success.longitude])
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

    const Map = useMemo(() => dynamic(
        () => import('@/components/maps/add-asset-map/'),
        {
            loading: () => <Skeleton className="w-full h-72" />,
            ssr: false
        }
    ), [])
    
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
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Asset Location</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={34} className="p-2 bg-muted rounded-md" />
                                        <Input
                                            type="text"
                                            placeholder="Location of property"
                                            {...field}
                                        />
                                            <FormField
                                                control={form.control}
                                                name="latitude"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Latitude"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="longitude"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Longitude"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="relative w-full h-80">
                            <div className="relative">
                                <Input 
                                    type="text"
                                    placeholder="Search location near you..."
                                    className="w-full px-2 py-1 mb-2"
                                    value={searchText}
                                    onChange={(e) => {
                                        setSearchText(e.target.value)
                                        const params = {
                                            q: searchText,
                                            format: "json",
                                            addressdetails: '1',
                                            polygon_geojson: '0',
                                        };
                                        const queryString = new URLSearchParams(params).toString();
                                        fetch(`${NOMINATIM_BASE_URL}${queryString}`, {
                                            method: 'GET',
                                            redirect: 'follow'
                                        })
                                        .then((response) => response.text())
                                        .then((result) => {
                                            setPlaceList(JSON.parse(result))
                                        })
                                        .catch((err) => console.log("err: ", err));
                                
                                    }}
                                 />
                                 <div className="max-h-36 transition duration-300 ease-in-out overflow-y-scroll bg-gray-200 dark:bg-gray-500 absolute z-[50000] flex flex-col gap-1 w-full">
                                    {placeList.map(place => {
                                        return (
                                            <div 
                                                className="z-[50000] dark:bg-gray-200 cursor-pointer border-b-2 border-gray-800 dark:border-gray-500 hover:text-gray-600 hover:bg-gray-100 px-2 py-1 text-gray-500"
                                                key={place?.place_id}
                                                onClick={() => {
                                                    const lat = parseFloat(place?.lat)
                                                    const lon = parseFloat(place?.lon)
                                                    setSelectedPosition([lat, lon])
                                                    form.setValue('location', `${place.address.county}, ${place.address.city ? place.address.city : place.address.state}`)
                                                    form.setValue('latitude', lat)
                                                    form.setValue('longitude', lon)
                                                    setPlaceList([])
                                                }}
                                            >
                                                {place.display_name}
                                            </div>
                                        )
                                    })}
                                 </div>
                            </div>
                            <Map 
                                posix={[form.getValues('latitude'), form.getValues('longitude')]} 
                                selectedPosition={selectedPosition}
                                setSelectedPosition={setSelectedPosition}
                                form={form}
                            />
                        </div>

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