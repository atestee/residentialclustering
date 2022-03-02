import {React, useEffect, useState} from "react";
import citiesJson from '../data/cities.json'
import {FormControl, InputLabel, MenuItem, Select, Button} from "@mui/material";
import './CityPicker.css'

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
        <div className="mainDiv">
            <div className="topPanel">
                <h2 className="header">Residential Clustering</h2>
                <div className="buttons">
                    <Button className="buttonBack" variant="outlined">Back</Button>
                    <Button variant="outlined" href={"/new-job/2"}>Next</Button>
                </div>
            </div>
            <div>
                <FormControl className="dropdown">
                    <InputLabel id="city-select-label">Select a city</InputLabel>
                    <Select
                        labelid="city-select-label"
                        label="Select a city"
                    >
                        {
                            cityList.map(city => (
                                <MenuItem value={city}>{city}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}