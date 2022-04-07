import {useMap} from "react-leaflet";
import {useEffect} from "react";

// source: https://react-leaflet.js.org/docs/api-map/#hooks
export function MyComponent() {
    const map = useMap()

    useEffect(() => {
        map.invalidateSize();
    })

    return null;
}