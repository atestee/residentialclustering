import {Component, React} from "react";
import {Alert, CircularProgress} from "@mui/material";
import {ParametersFormRow} from "./ParametersFormRow";
import './ParametersFormPage.css';
import {HeaderWithBackAndStartJob} from "../../Headers/HeaderWithBackAndStartJob";
import {ParametersFormPageMap} from "../../Maps/ParametersFormPageMap";
import {StartJobDialog} from "./StartJobDialog";

// The ID of transit type according to the GTFS specification
const transitTypes = {
    "METRO": 1,
    "TRAM": 0,
    "BUS": 3,
    "FUNICULAR": 7
}

// The parameters form page implementation
export class ParametersFormPage extends Component {
    isCheck = JSON.parse(this.props.storage.isCheck)
    // From which transit types at least one route was selected
    selectedTypes = Object.keys(this.isCheck).filter(type => this.isCheck[type].length > 0)
    analysisData = null

    constructor(props) {
        super(props);

        this.state = {
            // Which text input was blurred with empty input
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
            // Which text input was fill in the correct format
            wasFilled: {
                "jobName": false,
                "minWalkingDistance": false,
                "maxDrivingDistance": false,
                "maxDrivingTime": false,
                'numberOfStepsInCorridorMetro': !this.selectedTypes.includes("metro"),
                'numberOfStepsInCorridorBus': !this.selectedTypes.includes("bus"),
                'numberOfStepsInCorridorTram': !this.selectedTypes.includes("tram"),
                'numberOfStepsInCorridorFunicular': !this.selectedTypes.includes("funicular"),
                'nbins': false
            },
            showValidationErrorMessage: false,
            disableStartJobButton: true,
            showStartJobDialog: false,
            proceedClicked: false
        }
    }

    setProceedClickedTrue() {
        this.props.storage.clear();
        this.setState(()=> ({
            proceedClicked: true
        }))
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

                let newWasFilled = { ...state.wasFilled}
                newWasFilled[event.target.id] = true

                if (event.target.id !== "jobName") {
                    // All text inputs, except "job name" must be a positive number
                    newWasBlurred[event.target.id] = isNaN(event.target.value) || event.target.value <= 0
                } else {
                    newWasBlurred[event.target.id] = false
                }
                this.props.storage.setItem(event.target.id, event.target.value)

                return {
                    wasFilled: newWasFilled,
                    wasBlurred: newWasBlurred,
                    showValidationErrorMessage: Object.values(newWasBlurred).includes(true),
                    disableStartJobButton: Object.values(newWasFilled).includes(false) || Object.values(newWasBlurred).includes(true)
                };
            })
        }
    }
    // Returns the numberOfStepsInCorridor analysis parameter in the correct format
    getNumberOfStepsInCorridor(){
        return this.selectedTypes.map((type) => ({
            "transitType": transitTypes[type.toUpperCase()],
            "numberOfStops": Number(this.props.storage["numberOfStepsInCorridor" + type[0].toUpperCase() + type.slice(1)])
        }))
    }
    // Returns the includedRoutes analysis parameter in the correct format
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

    // Prepares the analysis input data and shows the dialog
    handleClickOnStartJob() {
        this.analysisData = {
            "jobName": this.props.storage.getItem("jobName"),
            "centerCoords": this.props.storage.getItem("centerCoords"),
            "excludedGeography": this.props.storage.getItem("selectedCenter"),
            "minWalkingDistanceMeters": this.props.storage.getItem("minWalkingDistance"),
            "maxDrivingDistanceMeters": this.props.storage.getItem("maxDrivingDistance"),
            "maxTaxiRideDurationMinutes": this.props.storage.getItem("maxDrivingTime"),
            "nbins": this.props.storage.getItem("nbins"),
            "numberOfPTStopsClustering": this.getNumberOfStepsInCorridor(),
            "includedRoutes": this.getIncludedRoutes(),
            "city": this.props.storage.getItem("selectedCity")
        }
        this.setState(() => ({
            showStartJobDialog: true
        }))
    }

    handleDialogClose() {
        this.setState({
            showStartJobDialog: false
        })
    }

    render() {
        if (this.state.proceedClicked) {
            return (
                <div style={{ display: "flex", height: "100vh"}}>
                    <CircularProgress size={100} style={{ margin: "auto" }}/>
                </div>
            )
        }

        let handlers = {
            handleBlur: this.handleBlur.bind(this),
            handleChange: this.handleChange.bind(this)
        }

        return (
            <div>
                <HeaderWithBackAndStartJob back="/new-job/3" next="/new-job/4" startJobButton={true} startJobButtonIsDisabled={this.state.disableStartJobButton} handleStartJob={this.handleClickOnStartJob.bind(this)}/>
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
                                        rowId={ "numberOfStepsInCorridor" + type[0].toUpperCase() + type.slice(1) }
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
                    {this.state.showStartJobDialog &&
                        <StartJobDialog
                            handleClose={this.handleDialogClose.bind(this)}
                            showStartJobDialog={this.state.showStartJobDialog}
                            setProceedClickedTrue={this.setProceedClickedTrue.bind(this)}
                            inputData={this.analysisData}
                        />
                    }
                </div>
            </div>
        )
    }
}