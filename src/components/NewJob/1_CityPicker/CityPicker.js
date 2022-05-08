import { Component, React } from "react";
import {Alert, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import './CityPicker.css';
import '../../Headers/HeaderStyles.css';
import {HeaderWithBackAndNext} from "../../Headers/HeaderWithBackAndNext";


export class CityPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityList: [],
            selectedCity: "",
            formIsInErrorState: false
        }
    }

    // get list of offered cities
    componentDidMount() {
        // get the list of available cities from server
        fetch("http://localhost:5000/api/cities/")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw response;

            })
            .then((data) => {
                let selectedCity = '';
                if (this.props.storage.hasOwnProperty("selectedCity")){
                    selectedCity = this.props.storage.getItem("selectedCity");
                }
                this.setState( {
                        selectedCity,
                        cityList: data
                    }
                );
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            })
    }

    handleChange(event){
        // check if the city was selected, if not set error to true and show the error message
        this.setState((state) => ({
            selectedCity: event.target.value,
            formIsInErrorState: state.selectedCity === ""
        }))

        // save the selected city into local storage
        this.props.storage.setItem("selectedCity", event.target.value)
    }

    handleClose(){
        // check if the city was selected, if not set error to true and show the error message
        this.setState((state) => ({
            formIsInErrorState: state.selectedCity === ""
        }))

        // save the selected city into local storage
        // this.props.storage.setItem("selectedCity", event.target.value)
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <HeaderWithBackAndNext back="/" next={"/new-job/2"} nextIsDisabled={this.state.selectedCity === ""}/>
                <h3 style={ { marginBottom: 16, marginLeft: 16 } }>Choose the analyzed city: </h3>
                { this.state.formIsInErrorState &&
                    <Alert style={ { marginBottom: 16, marginLeft: 16, width: 300 } } severity="error">
                        Analysed city wasn't selected!
                    </Alert>
                }
                <FormControl className="city-picker_form-control" error={this.state.formIsInErrorState} required={true} >
                    <InputLabel id="city-select-label">City</InputLabel>
                    <Select
                        value={this.state.selectedCity}
                        className="city-picker_form_select"
                        onChange={this.handleChange.bind(this)}
                        onClose={this.handleClose.bind(this)}
                        labelid="city-select-label"
                        label="City">
                        {
                            this.state.cityList.map(city => (
                                <MenuItem key={city} value={city} className="city-picker_form_select_menu-item">{city}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
        )
    }
}