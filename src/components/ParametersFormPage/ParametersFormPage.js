import {Component, React} from "react";
import {Alert, FormControl, InputAdornment, TextField} from "@mui/material";
import './ParametersFormPage.css';
import selectedTypes from '../../data/selectedTypes.json'
import {HeaderComponent} from "../HeaderComponent/HeaderComponent";
import L from "leaflet";

export class ParametersFormPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wasBlured: {
                "job-name": false,
                "min-walking-distance": false,
                "max-driving-distance": false,
                "max-driving-time": false,
                'number-of-steps-in-corridor-metro': false,
                'number-of-steps-in-corridor-bus': false,
                'number-of-steps-in-corridor-tram': false,
                'number-of-steps-in-corridor-funicular': false
            },
            showValidationErrorMessage: false
        }
    }

    componentDidMount() {
        let map = L.map('summaryMap', {
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
            let selectedCenterFromStorage = JSON.parse(this.props.storage.getItem("selectedCenter"))

            let selectedCenterLayer = new L.GeoJSON(selectedCenterFromStorage);
            selectedCenterLayer.addTo(map);
        }
    }

    handleBlur(event) {
        if (event.target.value === "") {
            this.setState((state) => {
                let newWasBlured = { ...state.wasBlured }

                newWasBlured[event.target.id] = true

                return {
                    wasBlured: newWasBlured,
                    showValidationErrorMessage: true
                };
            })
        }
    }

    handleChange(event) {
        if (event.target.value !== "") {
            this.setState((state) => {
                let newWasBlured = { ...state.wasBlured }

                if (event.target.id !== "job-name") {
                    newWasBlured[event.target.id] = isNaN(event.target.value)
                } else {
                    newWasBlured[event.target.id] = false
                }

                return {
                    wasBlured: newWasBlured,
                    showValidationErrorMessage: Object.keys(newWasBlured).includes(true)
                };
            })
        }
    }

    render() {
        return (
            <div>
                <HeaderComponent back="/new-job/3" next="/new-job/4" startJobButton={true}/>
                <h3 style={ { marginBottom: 16, marginLeft: 16 } }>Fill the form: </h3>
                <div className="parameters-form-page">
                    <form style={ { justifyContent: "space-between" } }>
                        {this.state.showValidationErrorMessage &&
                            <Alert style={ { marginBottom: 16, marginLeft: 16, width: 460 } } severity="error">
                                Please fill out all fields in correct format!
                            </Alert>}
                        <div className="parameters-form-page__form">
                            {/* Job name */}
                            <FormControl>
                                <div className="parameters-form-page__form-control">
                                    <label className="parameters-form-page__label">Job name</label>
                                    <TextField
                                        className="parameters-form-page__text-field"
                                        id='job-name'
                                        error={this.state.wasBlured["job-name"]}
                                        onBlur={this.handleBlur.bind(this)}
                                        onChange={this.handleChange.bind(this)}
                                    />
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
                                        error={this.state.wasBlured["min-walking-distance"]}
                                        onBlur={this.handleBlur.bind(this)}
                                        onChange={this.handleChange.bind(this)}
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
                                        error={this.state.wasBlured["max-driving-distance"]}
                                        onBlur={this.handleBlur.bind(this)}
                                        onChange={this.handleChange.bind(this)}
                                    />
                                </div>
                            </FormControl>

                            {/* Maximal driving time */}
                            <FormControl>
                                <div className="parameters-form-page__form-control">
                                    <label className="parameters-form-page__label">Maximal driving time</label>
                                    <TextField
                                        className="parameters-form-page__text-field"
                                        id = 'max-driving-time'
                                        InputProps = {{
                                            endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                                        }}
                                        error={this.state.wasBlured["max-driving-time"]}
                                        onBlur={this.handleBlur.bind(this)}
                                        onChange={this.handleChange.bind(this)}
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
                                                id = {'number-of-steps-in-corridor-' + {type}}
                                                error={this.state.wasBlured["number-of-steps-in-corridor-" + {type}]}
                                                onBlur={this.handleBlur.bind(this)}
                                                onChange={this.handleChange.bind(this)}
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