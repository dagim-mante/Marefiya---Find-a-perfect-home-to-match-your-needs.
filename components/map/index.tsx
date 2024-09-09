'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import L , { LatLngExpression, LatLngTuple } from 'leaflet'

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from "react";
import { useHits } from "react-instantsearch";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    zoom?: number,
    selectPosition: LatLngExpression | LatLngTuple | null
}

const defaults = {
    zoom: 19,
}

function ResetCenterView(props: any){
    const {selectPosition} = props
    const map = useMap()

    useEffect(() => {
        if(selectPosition){
            map.setView(
                L.latLng(selectPosition[0], selectPosition[1]),
                map.getZoom(),
                {
                    animate: true
                }
            )
        }
    }, [selectPosition])
    return null
}


const Map = (Map: MapProps) => {
    const { zoom = defaults.zoom, posix, selectPosition} = Map
    const [position, setPosition] = useState(null);
    const MapEventHandler = () => {
        useMapEvents({
          click(e) {
            setPosition(e.latlng); // Set the clicked latitude and longitude
            alert(`Latitude: ${e.latlng.lat}, Longitude: ${e.latlng.lng}`);
          },
        });
        return null;
      };

    const { items, sendEvent } = useHits();

    console.log("items", items)

    return (
        <MapContainer
            center={posix}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", position: "absolute", zIndex: 500000 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selectPosition ? (
                <Marker position={selectPosition}>
                    <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            ) : (
                <>
                    {items.map(item => (
                        <Marker key={item.id} position={[item._geoloc?.lat!, item._geoloc?.lng!]} draggable={false}>
                            <Popup>{item.query}</Popup>
                        </Marker>
                    ))}
                </>
            )}
            <ResetCenterView selectPosition={selectPosition} />
            <MapEventHandler />
        </MapContainer>
    )
}

export default Map