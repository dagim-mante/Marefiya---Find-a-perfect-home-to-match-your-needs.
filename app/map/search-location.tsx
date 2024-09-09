'use client'

import { useState } from "react";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?"

export default function SearchLocation({setSelectPosition}){
    const [searchText, setSearchText] = useState("");
    const [listPlace, setListPlace] = useState([])

    return (
        <div>
            <input 
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <button
                onClick={() => {
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
                        console.log(JSON.parse(result));
                        setListPlace(JSON.parse(result))
                    })
                    .catch((err) => console.log("err: ", err));
                }}
            >
                Search
            </button>
            <div>
                {listPlace.map((item) => {
                    return (
                        <div 
                            key={item?.place_id}
                            onClick={() => {
                                setSelectPosition([item?.lat, item?.lon])
                            }}
                        >
                            <h2>{item?.display_name}</h2>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}