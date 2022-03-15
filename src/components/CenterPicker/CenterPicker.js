import {Component, React} from "react";
import "./CenterPicker.css"
import L from "leaflet";
import "leaflet-draw";
import "../../../node_modules/leaflet-draw/dist/leaflet.draw.css";
import "../../../node_modules/leaflet/dist/leaflet.css";
import {HeaderComponent} from "../HeaderComponent/HeaderComponent";

export class CenterPicker extends Component {
    componentDidMount() {
        let map = L.map('mapForChoosingCenter', {
            center: [50.07501157760184, 14.416865286199549],
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
            preferCanvas: true,
        })

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

        map.addControl(editControl);
        map.addControl(drawControl);
        map.addLayer(drawnItems);

        // when polygon drawn we remove the control button for drawing polygons,
        // because only one polygon is expected
        map.on('draw:created', function(e) {
            drawnItems.addLayer(e.layer);
            console.log(drawnItems.getLayers()[0].toGeoJSON()); // polygon data
            map.removeControl(drawControl);
        });

        // when polygon remove we add the control button for drawing polygons
        map.on('draw:deleted', function() {
            map.addControl(drawControl);
        });
    }

    render() {
        return (
            <div>
                <HeaderComponent back="/new-job/2" next={"/new-job/4"}/>
                <div>
                    <div id={"mapForChoosingCenter"}></div>
                </div>
            </div>
        )
    }
}