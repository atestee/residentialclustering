import {Component} from "react";
import {CircularProgress} from "@mui/material";
import {RoutePicker} from "./RoutePicker";

export class RoutePickerDataLoader extends Component {
    routeTypesGrouped = {};

    constructor(props) {
        super(props);
        this.state = {
            availableRoutes: null,
            centerCoords: null
        }
    }

    componentDidMount() {
        // get all the data of the selected city (cityModel) = coords, public transport routes
        fetch('http://localhost:5000/api/city-model/' + this.props.storage.selectedCity)
            .then(response => response.json())
            .then(data => {
                Object.keys(data["availablePublicTransportRoutes"]).map((t) => (this.routeTypesGrouped)[t] = Object.keys(data["availablePublicTransportRoutes"][t]))
                this.props.storage.setItem("centerCoords", JSON.stringify(data["centerCoords"]))
                this.setState({
                    availableRoutes: data["availablePublicTransportRoutes"],
                    centerCoords: data["centerCoords"]
                })
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            })
        ;
    }

    render() {
        if (this.state.centerCoords) {
            return (<RoutePicker
                routeTypesGrouped={this.routeTypesGrouped}
                storage={this.props.storage}
                availableRoutes={this.state.availableRoutes}
                centerCoords={this.state.centerCoords}
            />)
        } else {
            return (
                <div style={{ display: "flex", height: "100vh"}}>
                    <CircularProgress size={100} style={{ margin: "auto" }}/>
                </div>
            )
        }
    }
}