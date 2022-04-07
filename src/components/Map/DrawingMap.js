import { Component, createRef } from "react";
import { MyMap } from "./MyMap";
import L from "leaflet";
import "leaflet-draw";
import "../../../node_modules/leaflet-draw/dist/leaflet.draw.css";
import "../../../node_modules/leaflet/dist/leaflet.css";

export class DrawingMap extends Component {
    constructor(props) {
        super(props);
        this.mapRef = createRef();
    }

    componentDidMount() {
        this.map = this.mapRef.current.map;
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

        this.map.on('draw:edited', function (e){
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
        return(
            <MyMap
                ref={ this.mapRef }
                centerCoords={ this.props.centerCoords }
                selectedRoutes={ this.props.selectedRoutes }
            />
        )
    }
}