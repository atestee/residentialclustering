import { Component } from "react";
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {GeoJSON, MapContainer, Marker, TileLayer, Tooltip, ZoomControl} from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import "./Map.css";
import "./IncludedExcludedMap.css";
import "leaflet/dist/leaflet.css";
import {MyComponent} from "./MyComponent";
import L from "leaflet";

import {FOCUSED_COLOR_BUILDINGS} from "../Visualization/HighLevelViz/HighLevelViz";

// The included / excluded map shown in the detailed visualization page
export class IncludedExcludedMap extends Component {
    // bounds and center of the cluster polygon, used for centering and zooming the map to display the cluster
    // in the center and big enough to fit in the map
    bounds = this.props.clusterPolygon["features"][0]["properties"]["bounds"]
    center = this.props.clusterPolygon["features"][0]["properties"]["center"]

    // the corresponding route linestring in the geojson format
    routeGeojson = {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "color": this.props.routeLinestring.color
                },
                "geometry": this.props.routeLinestring.geometry
            }
        ]
    };

    // defines the marker style for included res. buildings
    includedResidentialBuildingsStyle = {
        radius: 2,
        fillColor: FOCUSED_COLOR_BUILDINGS,
        color : FOCUSED_COLOR_BUILDINGS,
        opacity : 1,
        fillOpacity : 1
    }

    // defines the marker style for excluded res. buildings
    excludedResidentialBuildingsStyle = {
        radius: 2,
        fillColor: "grey",
        color : "grey",
        opacity : 1,
        fillOpacity : 1
    }

    constructor(props) {
        super(props);
        this.state = {
            map: null
        }
    }

    render() {
        // the blue square icon representing public transport stops on the map
        let stopIcon = L.icon({
            iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/1024px-Solid_blue.svg.png',
            iconSize: [15, 15],
        });
        return (
            // The map component
            <MapContainer id="map"
                          bounds={[this.bounds["southWest"], this.bounds["northEast"]]}
                          boundsOptions={{ maxZoom: 18 }}
                          center={this.center}
                          zoomSnap={0.2}
                          zoomDelta={1}
                          zoomControl={false}>
                {/* This component takes care of refreshing the map center when the "details" tab is opened */}
                <MyComponent />
                <TileLayer
                    attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                    className="basemap"
                    maxNativeZoom={18}
                    maxZoom={18}
                    url='https://stamen-tiles.a.ssl.fastly.net/{id}/{z}/{x}/{y}.png'
                    id='toner-lite'
                />
                <ZoomControl position="bottomleft" />
                {/* The control with radio buttons for switching between the heat map and the included / excluded map */}
                <Control position='topleft'>
                    <div className="map-control">
                        <FormControl>
                            <RadioGroup defaultValue="includedExcludedMap">
                                <div className="map-change-control__form">
                                    <FormControlLabel value="heatMap" control={<Radio value="heatMap" onChange={this.props.setShownMap}/>} label="Heat Map" />
                                    <FormControlLabel value="includedExcludedMap" control={<Radio />} label="Included / Excluded Map"/>
                                </div>
                            </RadioGroup>
                        </FormControl>
                    </div>
                </Control>
                {/* The legend component in the top-right corner of the map */}
                <Control position="topright">
                    <div className="map-control">
                        <div className="map-legend__row" key={"legend-row-included"}>
                            <div className='map-legend__box' style={{ backgroundColor: FOCUSED_COLOR_BUILDINGS }}/>
                            <span>Included buildings</span>
                        </div>
                        <div className="map-legend__row" key={"legend-row-excluded"}>
                            <div className='map-legend__box' style={{ backgroundColor: "gray" }}/>
                            <span>Excluded buildings</span>
                        </div>
                    </div>
                </Control>
                {/* The route layer shown in the map */}
                <GeoJSON data={this.routeGeojson} style={
                    function(feature) {
                        return {color: feature.properties.color}
                    }
                }/>
                {/* The cluster polygon layer shown in the map*/}
                <GeoJSON data={ this.props.clusterPolygon }/>
                {/* The included residential buildings layer shown in the map */}
                <GeoJSON data={ this.props.includedResidentialBuildings }
                         pointToLayer={ function (feature, latlng) {
                             return L.circleMarker(latlng, this.includedResidentialBuildingsStyle);
                         }.bind(this)}
                />
                {/* The excluded residential buildings layer shown in the map */}
                <GeoJSON data={ this.props.excludedResidentialBuildings }
                         pointToLayer={ function (feature, latlng) {
                             return L.circleMarker(latlng, this.excludedResidentialBuildingsStyle);
                         }.bind(this)}
                />
                {
                    // When a stop is hovered over, a tooltip with its name is shown
                    this.props.feedingTransitStops.map((stop) => (
                        <Marker key={stop.name} icon={stopIcon} position={[stop.latitude, stop.longitude]}>
                            <Tooltip direction="top">
                                {stop.name}
                            </Tooltip>
                        </Marker>
                    ))
                }
            </MapContainer>
        )
    }
}