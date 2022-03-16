import {Component, React} from "react";
import {FormControl, InputAdornment, TextField} from "@mui/material";
import './ParametersFormPage.css';
import selectedTypes from '../../data/selectedTypes.json'
import {HeaderComponent} from "../HeaderComponent/HeaderComponent";
import L from "leaflet";

export class ParametersFormPage extends Component {
    componentDidMount() {
        let map = L.map('summaryMap', {
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
            preferCanvas: true
        })

        if (this.props.storage.hasOwnProperty("routesGeoJson")) {
            let routesGeoJsonFromStorage = JSON.parse(this.props.storage.getItem("routesGeoJson"))

            let routesGeoJsonLayer = new L.GeoJSON(routesGeoJsonFromStorage, {
                style: function(feature) {
                    return {color: feature.properties.color};
                }
            });
            routesGeoJsonLayer.addTo(map);
        }

        if (this.props.storage.hasOwnProperty("selectedCenter")) {
            let routesGeoJsonFromStorage = JSON.parse(this.props.storage.getItem("selectedCenter"))

            let routesGeoJsonLayer = new L.GeoJSON(routesGeoJsonFromStorage);
            routesGeoJsonLayer.addTo(map);
        }


    }

    render() {
        return (
            <div>
                <HeaderComponent back="/new-job/3" next="/new-job/4" startJobButton={true}/>
                <div className="parameters-form-page">
                    <form>
                        <div className="parameters-form-page__form">
                            {/* Job name */}
                            <FormControl>
                                <div className="parameters-form-page__form-control">
                                    <label className="parameters-form-page__label">Job name</label>
                                    <TextField className="parameters-form-page__text-field" id='job-name'/>
                                </div>
                            </FormControl>

                            {/* Minimal walking distance */}
                            <FormControl>
                                <div className="parameters-form-page__form-control">
                                    <label className="parameters-form-page__label">Minimal walking distance</label>
                                    <TextField
                                        className="parameters-form-page__text-field"
                                        id = 'min-walking-distance'
                                        InputProps = {{
                                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                        }}
                                    />
                                </div>
                            </FormControl>

                            {/* Maximal driving distance */}
                            <FormControl>
                                <div className="parameters-form-page__form-control">
                                    <label className="parameters-form-page__label">Maximal driving distance</label>
                                    <TextField
                                        className="parameters-form-page__text-field"
                                        id = 'max-driving-distance'
                                        InputProps = {{
                                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                        }}
                                    />
                                </div>
                            </FormControl>

                            {/* Maximal driving time */}
                            <FormControl>
                                <div className="parameters-form-page__form-control">
                                    <label className="parameters-form-page__label">Maximal driving time</label>
                                    <TextField
                                        className="parameters-form-page__text-field"
                                        id = 'max-driving-distance'
                                        InputProps = {{
                                            endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                                        }}
                                    />
                                </div>
                            </FormControl>

                            {/*Number of stops in corridors*/}
                            {
                                selectedTypes.selectedTypesArray.map((type) => (
                                    <FormControl key={"number-of-stops-in-corridor-" + type}>
                                        <div className="parameters-form-page__form-control">
                                            <label className="parameters-form-page__label">Number of stops in corridor [{type}]</label>
                                            <TextField
                                                className="parameters-form-page__text-field"
                                                id = 'number-of-steps-in-corridor'
                                            />
                                        </div>
                                    </FormControl>
                                ))
                            }
                        </div>
                    </form>
                    <div className="parameters-form-page__map-div">
                        <div className="parameters-form-page__map" id={"summaryMap"}></div>
                    </div>
                </div>
            </div>
        )
    }
}