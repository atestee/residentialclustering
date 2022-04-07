import { Component, createRef, React } from "react";
import { Alert } from "@mui/material";
import { HeaderComponent } from "../HeaderComponent/HeaderComponent";
import { MyMap } from "../Map/MyMap";
import { ParametersFormRow } from "./ParametersFormRow";
import './ParametersFormPage.css';

import selectedTypes from '../../data/selectedTypes.json'

export class ParametersFormPage extends Component {
    constructor(props) {
        super(props);

        this.mapRef = createRef();

        this.state = {
            wasBlurred: {
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

    handleBlur(event) {
        if (event.target.value === "") {
            this.setState((state) => {
                let newWasBlurred = { ...state.wasBlurred }

                newWasBlurred[event.target.id] = true

                return {
                    wasBlurred: newWasBlurred,
                    showValidationErrorMessage: true
                };
            })
        }
    }

    handleChange(event) {
        if (event.target.value !== "") {
            this.setState((state) => {
                let newWasBlurred = { ...state.wasBlurred }

                if (event.target.id !== "job-name") {
                    newWasBlurred[event.target.id] = isNaN(event.target.value)
                } else {
                    newWasBlurred[event.target.id] = false
                }

                return {
                    wasBlurred: newWasBlurred,
                    showValidationErrorMessage: Object.keys(newWasBlurred).includes(true)
                };
            })
        }
    }

    render() {
        console.log(this.props.storage)

        let handlers = {
            handleBlur: this.handleBlur.bind(this),
            handleChange: this.handleChange.bind(this)
        }

        return (
            <div>
                <HeaderComponent back="/new-job/3" next="/new-job/4" startJobButton={true}/>
                <h3 className="parameters-form-page__instruction_header">Fill the form: </h3>
                <div className="parameters-form-page">
                    <form>
                        {this.state.showValidationErrorMessage &&
                            <Alert className="parameters-form-page__alert" severity="error">
                                Please fill out all fields in correct format!
                            </Alert>}
                        <div className="parameters-form-page__form">
                            <ParametersFormRow label="Job title" rowId="job-name" handlers={ handlers } wasBlurred={ this.state.wasBlurred }/>
                            <ParametersFormRow label="Minimal walking distance" rowId="min-walking-distance" handlers={ handlers } wasBlurred={ this.state.wasBlurred } endAdornment="m"/>
                            <ParametersFormRow label="Maximal driving distance" rowId="max-driving-distance" handlers={ handlers } wasBlurred={ this.state.wasBlurred } endAdornment="m"/>
                            <ParametersFormRow label="Maximal driving time" rowId="max-driving-time" handlers={ handlers } wasBlurred={ this.state.wasBlurred } endAdornment="min"/>
                            {
                                selectedTypes.selectedTypesArray.map((type) => (
                                    <ParametersFormRow
                                        label={ "Number of stops in corridor [" + type + "]" }
                                        rowId={ "number-of-steps-in-corridor-" + type }
                                        handlers={ handlers }
                                        wasBlurred={ this.state.wasBlurred }
                                        key={ "number-of-steps-in-corridor-" + type }
                                    />
                                ))
                            }
                        </div>
                    </form>
                    <div className="parameters-form-page__map-div">
                        <MyMap
                            ref={ this.mapRef }
                            centerCoords={ JSON.parse(this.props.storage.getItem("centerCoords")) }
                            selectedRoutes={ JSON.parse(this.props.storage.getItem("routesGeoJson")) }
                            selectedCenter={ JSON.parse(this.props.storage.getItem("selectedCenter")) }
                        />
                    </div>
                </div>
            </div>
        )
    }
}