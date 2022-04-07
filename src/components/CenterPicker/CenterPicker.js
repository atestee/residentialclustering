import { Component } from "react";
import "./CenterPicker.css";
import { HeaderComponent } from "../HeaderComponent/HeaderComponent";
import { DrawingMap } from "../Map/DrawingMap";

export class CenterPicker extends Component {
    render() {
        return (
            <div>
                <HeaderComponent back="/new-job/2" next="/new-job/4"/>
                <h3 style={ { marginLeft: 16, marginTop: 16, marginBottom: 4, height: "4vh" } }>Draw polygon of excluded city center (optional)</h3>
                <div className="center-picker-map-div" >
                    <DrawingMap
                        ref={ this.mapRef }
                        centerCoords={ JSON.parse(this.props.storage.getItem("centerCoords")) }
                        selectedRoutes={ JSON.parse(this.props.storage.getItem("routesGeoJson")) }
                        selectedCenter={ JSON.parse(this.props.storage.getItem("selectedCenter")) }
                        storage={ this.props.storage }
                    />
                </div>
            </div>
        )
    }
}