import { Component } from "react";
import L from "leaflet";
import "leaflet-draw";
import "../../../node_modules/leaflet-draw/dist/leaflet.draw.css";
import "../../../node_modules/leaflet/dist/leaflet.css";
import './Map.css'

// The map used in the center picker page
export class DrawingMap extends Component {
    componentDidMount() {
        // Map component initialization
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

        // previously selected routes are retrieved from the local storage
        L.geoJSON(JSON.parse(this.props.storage.getItem("routesGeoJson")), {
            style: function(feature) {
                return {color: feature.properties.color};
            }
        }).addTo(this.map);


        let drawnItems = new L.FeatureGroup();

        // drawControl: the control clicked to draw the polygon,
        //      - once a polygon is draw it is removed from the map,
        //      - when polygon is deleted, this control is added to the map
        let drawControl = new L.Control.Draw({
            draw : {
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false
            }
        });

        // editControl: control buttons for editing and deleting the polygon, they are always in the map
        let editControl = new L.Control.Draw({
            draw: false,
            edit: {
                featureGroup: drawnItems
            }
        });

        // adding layers to drawn item, which will be shown on the map
        function onEachFeature(feature, layer) {
            drawnItems.addLayer(layer);
        }

        // if the polygon representing the city center border was draw, it is added to the map as a geojson layer
        if (this.props.selectedCenter !== null) {
            L.geoJSON(this.props.selectedCenter, {
                onEachFeature: onEachFeature
            });
        }

        // editControl added to map
        this.map.addControl(editControl);

        // drawControl added to map only if a polygon has not been drawn
        if (drawnItems.getLayers().length === 0) {
            this.map.addControl(drawControl);
        }

        // drawnItems = polygon are added to the map
        this.map.addLayer(drawnItems);

        // handling click on drawControl button
        this.map.on('draw:created', function (e){
            drawnItems.addLayer(e.layer);
            this.map.removeControl(drawControl);
            // save the polygon data to local storage
            this.props.storage.setItem("selectedCenter", JSON.stringify(drawnItems.toGeoJSON()))
        }.bind(this));

        // handling click on the edit button from the editControl
        this.map.on('draw:edited', function (){
            // save the modified polygon data to localStorage
            this.props.storage.setItem("selectedCenter", JSON.stringify(drawnItems.toGeoJSON()))
        }.bind(this))

        // handling click on the delete button from the editControl
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