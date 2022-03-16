import { Component, React } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import './CityPicker.css';
import '../HeaderComponent/HeaderComponent.css';
import { HeaderComponent } from "../HeaderComponent/HeaderComponent";


export class CityPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityList: [],
            selectedCity: ""
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
                this.setState({
                    cityList: data.cityList
                })
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            })
    }

    handleChange(event){
        this.setState({
            selectedCity: event.target.value
        })

        // save the selected city into local storage
        this.props.storage.setItem("selectedCity", event.target.value)
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <HeaderComponent back="/" next={"/new-job/2"}/>
                <FormControl className="city-picker_form-control">
                    <InputLabel id="city-select-label">Select a city</InputLabel>
                    <Select
                        value={this.state.selectedCity}
                        className="city-picker_form_select"
                        onChange={this.handleChange.bind(this)}
                        labelid="city-select-label"
                        label="Select a city">
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