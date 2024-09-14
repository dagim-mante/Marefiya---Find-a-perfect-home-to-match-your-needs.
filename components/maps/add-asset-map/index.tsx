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
import { useEffect } from "react";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    selectedPosition: LatLngExpression | LatLngTuple | null,
    setSelectedPosition: () => void,
    form: any
}

function ResetCenterView(props: any){
    const {selectedPosition} = props
    const map = useMap()

    useEffect(() => {
        if(selectedPosition){
            map.flyTo(
                L.latLng(selectedPosition[0], selectedPosition[1]),
                17,
                {
                    animate: true
                }
            )
        }
    }, [selectedPosition])
    return null
}

export default function AddAssetMap(Map: MapProps){
    const {  posix, selectedPosition, setSelectedPosition, form} = Map
    const MapEventHandler = () => {
        useMapEvents({
          click(e) {
            setSelectedPosition([e.latlng.lat, e.latlng.lng])
            form.setValue('latitude', e.latlng.lat)
            form.setValue('longitude', e.latlng.lng)
          },
        });
        return null;
      };
    return (
        <div className="w-full h-60">
            <MapContainer
                center={posix}
                zoom={12}
                scrollWheelZoom={true}
                style={{ position: "relative", width: "100%", height: "288px"}}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {selectedPosition ? (
                    <>
                        <ResetCenterView selectedPosition={selectedPosition} />
                        <Marker position={selectedPosition}>
                            <Popup>
                                Your Location
                            </Popup>
                        </Marker>
                    </>
                ) : null }
                <MapEventHandler />
            </MapContainer>
        </div>
    )
}