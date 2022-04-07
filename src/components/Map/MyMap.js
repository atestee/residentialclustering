import { Component } from "react";
import '../RoutePicker/RoutePicker.css'
import './MyMap.css'
import L from "leaflet";


export class MyMap extends Component {
    componentDidMount() {
        this.map = L.map("map", {
            center: this.props.centerCoords,
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

        if (this.props.selectedRoutes !== null) {
            let routesGeoJson = this.props.selectedRoutes;
            let routesGeoJsonLayer = new L.GeoJSON(routesGeoJson, {
                style: function(feature) {
                    return {color: feature.properties.color};
                }
            });
            routesGeoJsonLayer.addTo(this.map)
        }

        if (this.props.selectedCenter !== null) {
            let selectedCenterGeoJson = this.props.selectedCenter;
            let selectedCenterLayer = new L.GeoJSON(selectedCenterGeoJson);
            selectedCenterLayer.addTo(this.map)
        }
    }

    render() {
        return (
            <div id="map"/>
        )
    }
}