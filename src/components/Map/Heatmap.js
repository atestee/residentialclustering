import { Component } from "react";
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {MapContainer, Popup, TileLayer} from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import "./MyMap.css";
import "./Heatmap.css";
import "leaflet/dist/leaflet.css";
import { MyComponent } from "./MyComponent";

export class Heatmap extends Component {
    render() {
        return (
            <MapContainer center={this.props.centerCoords} zoom={13} id="map">
                <MyComponent />
                <TileLayer
                    attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                    className="basemap"
                    maxNativeZoom={18}
                    maxZoom={18}
                    url='https://stamen-tiles.a.ssl.fastly.net/{id}/{z}/{x}/{y}.png'
                    id='toner-lite'
                />
                <Control position='topright'>
                    <div className="map-change-control">
                        <FormControl>
                            {/*<FormLabel>Map</FormLabel>*/}
                            <RadioGroup defaultValue="heatMap">
                                <div className="map-change-control__form">
                                    <FormControlLabel value="heatMap" control={<Radio />} label="Heat Map" />
                                    <FormControlLabel value="includedExcludedMap" control={<Radio value="includedExcludedMap" onChange={this.props.setShownMap}/>} label="Included / Excluded Map"/>
                                </div>
                            </RadioGroup>
                        </FormControl>
                    </div>
                </Control>
                <Popup position={this.props.centerCoords}>
                    Heat Map
                </Popup>
            </MapContainer>
        )
    }
}