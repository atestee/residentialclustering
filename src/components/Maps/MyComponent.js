import {useMap} from "react-leaflet";
import {useEffect} from "react";

// This component makes use of the JS Leaflet function invalidateSize() to center the maps that were created using react-leaflet
// source: https://react-leaflet.js.org/docs/api-map/#hooks
export function MyComponent() {
    const map = useMap()

    useEffect(() => {
        map.invalidateSize();
    })

    return null;
}