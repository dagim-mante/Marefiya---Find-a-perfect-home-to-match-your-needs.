'use client'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents
} from "react-leaflet"
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import L , { LatLngExpression, LatLngTuple } from 'leaflet'

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Map as MapLucide, MapPin } from "lucide-react"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useHits } from "react-instantsearch";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
}

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?"
  
export default function SearchMap(Map: MapProps){
    const { posix } = Map
    const [searchText, setSearchText] = useState('')
    const [placeList, setPlaceList] = useState([])

    const { items, sendEvent } = useHits();

    console.log("items", items)

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="ml-2">
                    <MapLucide className="w-5 h-5 mr-1" />
                    <span className="text-xs font-bold">Open Map</span> 
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="flex flex-col gap-1 justify-center items-center my-2">
                    <DialogTitle>Search on Map</DialogTitle>
                    <DialogDescription>Filter based on location</DialogDescription>
                </div>
                <div className="lg:p-0 p-4 w-full max-w-4xl mx-auto relative h-80">
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
                                                setPlaceList([])
                                            }}
                                        >
                                            {place.display_name}
                                        </div>
                                    )
                                })}
                            </div>
                    </div>
                    <div className="w-full h-60 pb-2">
                        <MapContainer
                            center={posix}
                            zoom={11}
                            scrollWheelZoom={true}
                            style={{ position: "relative", width: "100%", height: "100%"}}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {items.map(item => (
                                <Marker key={item.id} position={[item._geoloc?.lat!, item._geoloc?.lng!]} draggable={false}>
                                    <Popup className="flex flex-col gap-1">
                                        <div className="w-full h-20">
                                            <Link
                                              href={`/assets/${item.id}`}
                                              className="mt-1 font-bold text-center"
                                            >
                                                <img 
                                                    src={item.image}
                                                    alt="Asset Image"
                                                    className="block w-full h-12"
                                                />
                                                <span className="block text-black text-10px] my-[3px]">{formatPrice(item.price, item.type, item.rentType)}</span>
                                                <span className="text-black text-[10px] flex items-center"><MapPin className="w-4 h-4 mr-1" />{item.location.split(',')[0]}</span>
                                            </Link>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}