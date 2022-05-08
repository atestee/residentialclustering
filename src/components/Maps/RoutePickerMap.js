import {Component} from "react";
import L from "leaflet";
import './Map.css'


export class RoutePickerMap extends Component {
    map = null;
    routesGeoJsonLayer = null;

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

        if (this.props.routesGeojson !== null) {
            this.routesGeoJsonLayer = new L.GeoJSON(this.props.routesGeojson, {
                style: function(feature) {
                    return {color: feature.properties.color};
                }
            });
            this.routesGeoJsonLayer.addTo(this.map)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.routesGeoJsonLayer.remove()
        if (this.props.routesGeojson !== null) {
            this.routesGeoJsonLayer = new L.GeoJSON(this.props.routesGeojson, {
                style: function(feature) {
                    return {color: feature.properties.color};
                }
            });
            this.routesGeoJsonLayer.addTo(this.map)
        }
    }

    render() {
        return (
            <div id="map"/>
        )
    }
}