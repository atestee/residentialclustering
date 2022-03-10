import {React, useEffect, useState} from "react";
import citiesJson from '../../data/cities.json'
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import './CityPicker.css';
import '../HeaderComponent/HeaderComponent.css';
import {HeaderComponent} from "../HeaderComponent/HeaderComponent";

export function CityPicker() {
    let [cityList, setCityList] = useState([]);
    console.log(citiesJson)

    // useEffect(() => {
    //     fetch("http://localhost:5000/api/")
    //         .then(
    //             (response) => {
    //                 if (response.ok) {
    //                     return response.json();
    //                 }
    //                 throw response;
    //             }
    //         ).then((data) => {
    //             setCityList(data.cities);
    //         }).catch((error) => {
    //             console.error("Error fetching data: " + error);
    //         })
    // }, []);

    useEffect(() => {
        setCityList(citiesJson.cities);
        console.log(cityList)
    }, [cityList])

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <HeaderComponent back="/" next={"/new-job/2"}/>
            <FormControl className="city-picker_form-control">
                <InputLabel id="city-select-label">Select a city</InputLabel>
                <Select
                    labelid="city-select-label"
                    label="Select a city">
                    {
                        cityList.map(city => (
                            <MenuItem value={city}>{city}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </div>
    );
}