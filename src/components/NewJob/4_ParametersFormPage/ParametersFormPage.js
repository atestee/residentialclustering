import {Component, React} from "react";
import {Alert} from "@mui/material";
import {ParametersFormRow} from "./ParametersFormRow";
import './ParametersFormPage.css';
import {HeaderWithBackAndStartJob} from "../../Headers/HeaderWithBackAndStartJob";
import {ParametersFormPageMap} from "../../Maps/ParametersFormPageMap";
// import postData from "../rest.js";

const transitTypes = {
    "METRO": 1,
    "TRAM": 0,
    "BUS": 3,
    "FUNICULAR": 7
}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export class ParametersFormPage extends Component {
    isCheck = JSON.parse(this.props.storage.isCheck)
    selectedTypes = Object.keys(this.isCheck).filter(type => this.isCheck[type].length > 0)
    numberOfInputs = 5 + this.selectedTypes.length;

    constructor(props) {
        super(props);

        this.state = {
            wasBlurred: {
                "jobName": false,
                "minWalkingDistance": false,
                "maxDrivingDistance": false,
                "maxDrivingTime": false,
                'numberOfStepsInCorridorMetro': false,
                'numberOfStepsInCorridorBus': false,
                'numberOfStepsInCorridorTram': false,
                'numberOfStepsInCorridorFunicular': false,
                'nbins': false
            },
            numberOfFilled: 0,
            showValidationErrorMessage: false,
            disableStartJobButton: false
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

                if (event.target.id !== "jobName") {
                    newWasBlurred[event.target.id] = isNaN(event.target.value)
                } else {
                    newWasBlurred[event.target.id] = false
                }
                this.props.storage.setItem(event.target.id, event.target.value)

                return {
                    wasBlurred: newWasBlurred,
                    showValidationErrorMessage: Object.keys(newWasBlurred).includes(true)
                };
            })
        }
    }

    getNumberOfStepsInCorridor(){
        return this.selectedTypes.map((type) => ({
            "transitType": transitTypes[type.toUpperCase()],
            "numberOfStops": Number(this.props.storage["numberOfStepsInCorridor-" + type])
        }))
    }

    getIncludedRoutes() {
        return this.selectedTypes.map((type) => {
            let isCheckAll = JSON.parse(this.props.storage.getItem("isCheckAll"))[type];
            if (isCheckAll) {
                return ({
                    "transitType": transitTypes[type.toUpperCase()],
                    "inclusionType": "ALL"
                })
            } else {
                return ({
                    "transitType": transitTypes[type.toUpperCase()],
                    "inclusionType": "SUBSET",
                    "lines": JSON.parse(this.props.storage.getItem("isCheck"))[type]
                })
            }
        });
    }

    handleStartJob() {
        let newJobData = {
            "jobName": this.props.storage.getItem("jobName"),
            "excludedGeography": this.props.storage.getItem("selectedCenter"),
            "minWalkingDistanceMeters": this.props.storage.getItem("minWalkingDistance"),
            "maxDrivingDistanceMeters": this.props.storage.getItem("maxDrivingDistance"),
            "maxTaxiRideDurationMinutes": this.props.storage.getItem("maxDrivingTime"),
            "nbins": this.props.storage.getItem("nbins"),
            "numberOfPTStopsClustering": this.getNumberOfStepsInCorridor(),
            "includedRoutes": this.getIncludedRoutes()
        }

        // POST req: new-job
        postData('http://localhost:5000/api/new-job', newJobData)
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
            });

    }

    render() {
        let handlers = {
            handleBlur: this.handleBlur.bind(this),
            handleChange: this.handleChange.bind(this)
        }

        return (
            <div>
                <HeaderWithBackAndStartJob back="/new-job/3" next="/new-job/4" startJobButton={true} nextIsDisabled={this.state.disableStartJobButton} handleStartJob={this.handleStartJob.bind(this)}/>
                <h3 className="parameters-form-page__instruction_header">Fill the form: </h3>
                <div className="parameters-form-page">
                    <form>
                        {this.state.showValidationErrorMessage &&
                            <Alert className="parameters-form-page__alert" severity="error">
                                Please fill out all fields in correct format!
                            </Alert>}
                        <div className="parameters-form-page__form">
                            <ParametersFormRow label="Job title *" rowId="jobName" handlers={ handlers } wasBlurred={ this.state.wasBlurred }/>
                            <ParametersFormRow label="Minimal walking distance *" rowId="minWalkingDistance" handlers={ handlers } wasBlurred={ this.state.wasBlurred } endAdornment="m"/>
                            <ParametersFormRow label="Maximal driving distance *" rowId="maxDrivingDistance" handlers={ handlers } wasBlurred={ this.state.wasBlurred } endAdornment="m"/>
                            <ParametersFormRow label="Maximal driving time *" rowId="maxDrivingTime" handlers={ handlers } wasBlurred={ this.state.wasBlurred } endAdornment="min"/>
                            <ParametersFormRow label="Number of bins in histograms *" rowId="nbins" handlers={ handlers } wasBlurred={ this.state.wasBlurred }/>
                            {
                                this.selectedTypes.map((type) => (
                                    <ParametersFormRow
                                        label={ "Number of stops in corridor [" + type + "] *" }
                                        rowId={ "numberOfStepsInCorridor-" + type }
                                        handlers={ handlers }
                                        wasBlurred={ this.state.wasBlurred }
                                        key={ "numberOfStepsInCorridor-" + type }
                                    />
                                ))
                            }
                        </div>
                    </form>
                    <div className="parameters-form-page__map-div">
                        <ParametersFormPageMap
                            storage={this.props.storage}
                        />
                    </div>
                </div>
            </div>
        )
    }
}