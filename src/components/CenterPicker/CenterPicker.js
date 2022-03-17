import {Component, React} from "react";
import "./CenterPicker.css"
import L from "leaflet";
import "leaflet-draw";
import "../../../node_modules/leaflet-draw/dist/leaflet.draw.css";
import "../../../node_modules/leaflet/dist/leaflet.css";
import {HeaderComponent} from "../HeaderComponent/HeaderComponent";

export class CenterPicker extends Component {
    selectedCenterGeoJson = null

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        let map = L.map('mapForChoosingCenter', {
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
        })

        function onEachFeature(feature, layer) {
            drawnItems.addLayer(layer);
        }

        let drawnItems = new L.FeatureGroup()

        if (this.props.storage.hasOwnProperty("selectedCenter")) {
            L.geoJSON(JSON.parse(this.props.storage.getItem("selectedCenter")), {
                onEachFeature: onEachFeature
            });
        }

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

        map.addControl(editControl);
        if (drawnItems.getLayers().length === 0) {
            map.addControl(drawControl);
        }
        map.addLayer(drawnItems);

        // when polygon drawn we remove the control button for drawing polygons,
        // because only one polygon is expected
        map.on('draw:created', function (e){
            drawnItems.addLayer(e.layer);
            map.removeControl(drawControl);

            // save the polygon data to local storage
            this.props.storage.setItem("selectedCenter", JSON.stringify(drawnItems.toGeoJSON()))
        }.bind(this));

        map.on('draw:edited', function (e){
            // save the modified polygon data to localStorage
            this.props.storage.setItem("selectedCenter", JSON.stringify(drawnItems.toGeoJSON()))
        }.bind(this))

        // when polygon remove we add the control button for drawing polygons and remove the data from localStorage
        map.on('draw:deleted', function() {
            map.addControl(drawControl)
            this.props.storage.removeItem("selectedCenter")
        }.bind(this));

        if (this.props.storage.hasOwnProperty("routesGeoJson")) {
            let routesGeoJsonFromStorage = JSON.parse(this.props.storage.getItem("routesGeoJson"))

            let routesGeoJsonLayer = new L.GeoJSON(routesGeoJsonFromStorage, {
                style: function(feature) {
                    return {color: feature.properties.color};
                }
            });
            routesGeoJsonLayer.addTo(map);
        }
    }

    render() {
        return (
            <div>
                <HeaderComponent back="/new-job/2" next={"/new-job/4"}/>
                <h3 style={ { marginBottom: 16, marginLeft: 16 } }>Draw polygon of excluded city center (optional)</h3>
                <div>
                    <div id={"mapForChoosingCenter"}></div>
                </div>
            </div>
        )
    }
}