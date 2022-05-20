import { Component } from "react";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import {GeoJSON, MapContainer, TileLayer, ZoomControl, Marker, Tooltip} from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import "./Map.css";
import "./Heatmap.css";
import "leaflet/dist/leaflet.css";
import { MyComponent } from "./MyComponent";
import L from "leaflet";

// The heatmap shown in the detailed visualization page
export class Heatmap extends Component {
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

    constructor(props) {
        super(props);
        this.state = {
            // the group of residential buildings that are in the same distance group,
            // according to the taxi ride distance histogram
            // when the cursor is hovered over one of bars representing a group of residential buildings,
            // these buildings are shown on the map and the others buildings are removed from the map
            focusedDistanceGroupIndex: props.focusedDistanceGroupIndex
        }
    }

    // this function calculates what distance group this feature belongs to and
    // assigns a color from the predefined color gradient (this.props.colorGradientArray)
    getStyle(feature) {
        let idx = Math.floor(feature.properties.taxiRideDistanceMeters / (this.props.jobParameters.maxDrivingDistanceMeters / this.props.nbins));
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
        // the blue square icon representing public transport stops on the map
        let stopIcon = L.icon({
            iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/1024px-Solid_blue.svg.png',
            iconSize: [15, 15],
        });

        return (
            // The map component
            <MapContainer bounds={[this.bounds["southWest"], this.bounds["northEast"]]}
                          boundsOptions={{ maxZoom: 18 }}
                          center={this.center}
                          zoomSnap={0.2}
                          zoomDelta={1}
                          zoomControl={false}
                          id="map">
            >
                {/* This component takes care of refreshing the map center when the "details" tab is opened */}
                <MyComponent />
                <TileLayer
                    attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>,
                    under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.
                    Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                    className="basemap"
                    maxZoom={18}
                    url='https://stamen-tiles.a.ssl.fastly.net/{id}/{z}/{x}/{y}.png'
                    id='toner-lite'
                />
                <ZoomControl position="bottomleft" />
                {/* The control with radio buttons for switching between the heat map and the included / excluded map */}
                <Control position='topleft'>
                    <div className="map-control">
                        <FormControl>
                            <RadioGroup defaultValue="heatMap">
                                <div className="map-change-control__form">
                                    <FormControlLabel value="heatMap" control={<Radio />} label="Heat Map" />
                                    <FormControlLabel value="includedExcludedMap"
                                                      control={<Radio value="includedExcludedMap" onChange={this.props.setShownMap}/>}
                                                      label="Included / Excluded Map"
                                    />
                                </div>
                            </RadioGroup>
                        </FormControl>
                    </div>
                </Control>
                {/* The legend component in the top-right corner of the map */}
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
                {/* The route layer shown in the map */}
                <GeoJSON data={this.routeGeojson} style={
                    function(feature) {
                        return {color: feature.properties.color}
                    }
                }/>
                {/* The cluster polygon layer shown in the map*/}
                <GeoJSON data={ this.props.clusterPolygon }/>
                {/* The included residential buildings layer shown in the map */}
                <GeoJSON data={this.props.includedResidentialBuildings}
                         key={"buildings-geojson-" + this.props.focusedDistanceGroupIndex}
                         pointToLayer={function (feature, latlng) {
                             const idx = Math.floor(feature.properties.taxiRideDistanceMeters / (this.props.jobParameters.maxDrivingDistanceMeters / this.props.nbins));
                             // if a distance group was not chosen, all included res. buildings are shown
                             if (this.props.focusedDistanceGroupIndex === null) {
                                 return L.circleMarker(latlng, this.getStyle(feature));
                             } else {
                                 // if a distance group was chosen, only included res. buildings
                                 // from this group are assigned a color
                                 if (idx === this.props.focusedDistanceGroupIndex) {
                                     return L.circleMarker(latlng, this.getStyle(feature));
                                 } else {
                                     // the buildings that do not belong to the chosen
                                     // distance group are not assigned a color
                                     return null
                                 }
                             }
                         }.bind(this)}
                />
                {
                    // When a stop is hovered over, a tooltip with its name is shown
                    this.props.feedingTransitStops.map((stop) => (
                        <Marker key={stop.name}
                                icon={stopIcon}
                                position={[stop.latitude, stop.longitude]}
                        >
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