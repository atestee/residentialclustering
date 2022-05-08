import { Component } from "react";
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {GeoJSON, MapContainer, TileLayer, ZoomControl} from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import "./Map.css";
import "./IncludedExcludedMap.css";
import "leaflet/dist/leaflet.css";
import {MyComponent} from "./MyComponent";
import L from "leaflet";

import {
    FOCUSED_COLOR_BUILDINGS
} from "../Visualization/HighLevelViz/HighLevelViz";


export class IncludedExcludedMap extends Component {
    bounds = this.props.clusterPolygon["features"][0]["properties"]["bounds"]
    center = this.props.clusterPolygon["features"][0]["properties"]["center"]

    includedResidentialBuildingsStyle = {
        radius: 2,
        fillColor: FOCUSED_COLOR_BUILDINGS,
        color : FOCUSED_COLOR_BUILDINGS,
        opacity : 1,
        fillOpacity : 1
    }

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
        return (
            <MapContainer id="map"
                          bounds={[this.bounds["southWest"], this.bounds["northEast"]]}
                          boundsOptions={{ maxZoom: 18 }}
                          center={this.center}
                          zoomSnap={0.2}
                          zoomDelta={1}
                          zoomControl={false}>
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
                <GeoJSON data={ this.props.clusterPolygon }/>
                <GeoJSON data={ this.props.includedResidentialBuildings }
                         pointToLayer={ function (feature, latlng) {
                             return L.circleMarker(latlng, this.includedResidentialBuildingsStyle);
                         }.bind(this)}
                />
                <GeoJSON data={ this.props.excludedResidentialBuildings }
                         pointToLayer={ function (feature, latlng) {
                             return L.circleMarker(latlng, this.excludedResidentialBuildingsStyle);
                         }.bind(this)}
                />
            </MapContainer>
        )
    }
}