import { Component } from "react";
import L from "leaflet";
import "leaflet-draw";
import "../../../node_modules/leaflet-draw/dist/leaflet.draw.css";
import "../../../node_modules/leaflet/dist/leaflet.css";
import './Map.css'

export class DrawingMap extends Component {
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

        L.geoJSON(JSON.parse(this.props.storage.getItem("routesGeoJson")), {
            style: function(feature) {
                return {color: feature.properties.color};
            }
        }).addTo(this.map);

        let drawnItems = new L.FeatureGroup();
        let drawControl = new L.Control.Draw({
            draw : {
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false
            }
        });

        let editControl = new L.Control.Draw({
            draw: false,
            edit: {
                featureGroup: drawnItems
            }
        });

        function onEachFeature(feature, layer) {
            drawnItems.addLayer(layer);
        }

        if (this.props.selectedCenter !== null) {
            L.geoJSON(this.props.selectedCenter, {
                onEachFeature: onEachFeature
            });
        }

        this.map.addControl(editControl);
        if (drawnItems.getLayers().length === 0) {
            this.map.addControl(drawControl);
        }
        this.map.addLayer(drawnItems);

        this.map.on('draw:created', function (e){
            drawnItems.addLayer(e.layer);
            this.map.removeControl(drawControl);
            // save the polygon data to local storage
            this.props.storage.setItem("selectedCenter", JSON.stringify(drawnItems.toGeoJSON()))
        }.bind(this));

        this.map.on('draw:edited', function (){
            // save the modified polygon data to localStorage
            this.props.storage.setItem("selectedCenter", JSON.stringify(drawnItems.toGeoJSON()))
        }.bind(this))

        // when polygon remove we add the control button for drawing polygons and remove the data from localStorage
        this.map.on('draw:deleted', function() {
            this.map.addControl(drawControl)
            this.props.storage.removeItem("selectedCenter")
        }.bind(this));
    }

    render(){
        return (
            <div id="map"/>
        )
    }
}