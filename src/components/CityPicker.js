import {React, useEffect, useState} from "react";
import citiesJson from '../data/cities.json'
import {FormControl, InputLabel, MenuItem, Select, Button} from "@mui/material";
import {LinkPicker} from "./LinkPicker";

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
        <div style={{textAlign: `center`}}>
            <h2>Residential Clustering</h2>
            <FormControl style={{minWidth: 200}}>
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
            <br/>
            <Button>Back</Button>
            <Button href={"/new-job/2"}>Next</Button>
        </div>
    );
}