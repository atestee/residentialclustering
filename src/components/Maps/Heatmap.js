import { Component } from "react";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import {GeoJSON, MapContainer, TileLayer, ZoomControl, Marker} from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import "./Map.css";
import "./Heatmap.css";
import "leaflet/dist/leaflet.css";
import { MyComponent } from "./MyComponent";
import L from "leaflet";

export class Heatmap extends Component {
    bounds = this.props.clusterPolygon["features"][0]["properties"]["bounds"]
    center = this.props.clusterPolygon["features"][0]["properties"]["center"]

    constructor(props) {
        super(props);
        this.state = {
            focusedDistanceGroupIndex: props.focusedDistanceGroupIndex
        }
    }

    getStyle(feature) {
        let idx = Math.floor(feature.properties.taxiRideDistanceMeters / (this.props.jobParameters.maxDrivingDistanceMeters / 7));
        const color = this.props.colorGradientArray[idx];
        return ({
            radius: 3,
            fillColor: color,
            color: color,
            opacity: 0.1,
            fillOpacity: 0.8
        })
    }

    render() {
        let busIcon = L.icon({
            iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/1024px-Solid_blue.svg.png',
            iconSize: [15, 15],
        });

        return (
            <MapContainer bounds={[this.bounds["southWest"], this.bounds["northEast"]]}
                          boundsOptions={{ maxZoom: 18 }}
                          center={this.center}
                          zoomSnap={0.2}
                          zoomDelta={1}
                          zoomControl={false}
                          id="map">
            >
                <MyComponent ref={this.mapRef}/>
                <TileLayer
                    attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                    className="basemap"
                    maxZoom={18}
                    url='https://stamen-tiles.a.ssl.fastly.net/{id}/{z}/{x}/{y}.png'
                    id='toner-lite'
                />
                <ZoomControl position="bottomleft" />
                <Control position='topleft'>
                    <div className="map-control">
                        <FormControl>
                            <RadioGroup defaultValue="heatMap">
                                <div className="map-change-control__form">
                                    <FormControlLabel value="heatMap" control={<Radio />} label="Heat Map" />
                                    <FormControlLabel value="includedExcludedMap" control={<Radio value="includedExcludedMap" onChange={this.props.setShownMap}/>} label="Included / Excluded Map"/>
                                </div>
                            </RadioGroup>
                        </FormControl>
                    </div>
                </Control>
                <Control position="topright">
                    <div className="map-control">
                        {this.props.legendValuesArray.map((elem, index) => (
                            <div className="map-legend__row" key={"legend-row-" + index}>
                                <div className='map-legend__box' style={{ backgroundColor: this.props.colorGradientArray[index] }}/>
                                <span>{elem} km</span>
                            </div>
                        ))}
                    </div>
                </Control>
                <GeoJSON data={ this.props.clusterPolygon }/>
                <GeoJSON data={this.props.includedResidentialBuildings}
                         key={"buildings-geojson-" + this.props.focusedDistanceGroupIndex}
                         pointToLayer={function (feature, latlng) {
                             const idx = Math.floor(feature.properties.taxiRideDistanceMeters / (this.props.jobParameters.maxDrivingDistanceMeters / 7));
                             if (this.props.focusedDistanceGroupIndex === null) {
                                 return L.circleMarker(latlng, this.getStyle(feature));
                             } else {
                                 if (idx === this.props.focusedDistanceGroupIndex) {
                                     return L.circleMarker(latlng, this.getStyle(feature));
                                 } else {
                                     return null
                                 }
                             }
                         }.bind(this)}
                />
                {
                    this.props.feedingTransitStops.map((stop) => (
                        <Marker key={stop.name} icon={busIcon} position={[stop.latitude, stop.longitude]}/>
                    ))
                }
            </MapContainer>
        )
    }
}