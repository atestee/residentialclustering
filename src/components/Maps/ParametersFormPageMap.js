import {Component} from "react";
import './Map.css'
import L from "leaflet";


export class ParametersFormPageMap extends Component {
    componentDidMount() {
        this.map = L.map("map", {
            center: JSON.parse(this.props.storage.getItem("centerCoords")),
            zoom: 13,
            layers: [
                L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/{id}/{z}/{x}/{y}.png', {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
                    maxZoom: 18,
                    id: 'toner-lite',
                    tileSize: 512,
                    zoomOffset: -1
                }),
            ],
            preferCanvas: true
        });

        L.geoJSON(JSON.parse(this.props.storage.getItem("routesGeoJson")), {
            style: function(feature) {
                return {color: feature.properties.color};
            }
        }).addTo(this.map);

        if (this.props.storage.hasOwnProperty("selectedCenter")) {
            L.geoJSON(JSON.parse(this.props.storage.getItem("selectedCenter"))).addTo(this.map);
        }
    }

    render() {
        return (
            <div id="map"/>
        )
    }
}