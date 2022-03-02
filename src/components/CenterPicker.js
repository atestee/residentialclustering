import {Component, React} from "react";
import {Button} from "@mui/material";
import "./CenterPicker.css"
import L from "leaflet";
import "leaflet-draw";

export class CenterPicker extends Component {
    map = null;

    componentDidMount() {
        this.map = L.map('mapForChoosingCenter', {
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
            preferCanvas: true,
            drawControl: true
        })

    }

    render() {
        return (
            <div className="mainDiv">
                <h2 className="header">Choose the excluded center</h2>
                <div className="buttons">
                    <Button className="buttonBack" variant="outlined" href={"/new-job/2"}>Back</Button>
                    <Button variant="outlined">Next</Button>
                </div>
                <div className="inputDiv">
                    <div id={"mapForChoosingCenter"}></div>
                </div>
            </div>
        )
    }
}