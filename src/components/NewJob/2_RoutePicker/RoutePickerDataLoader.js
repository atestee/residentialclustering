import {Component} from "react";
import {CircularProgress} from "@mui/material";
import {RoutePicker} from "./RoutePicker";

// A wrapper component for the route picker component
// Fetches city model data from the server
// Before the data is loaded, a circular progress is rendered
// After the data is loaded, the route picker page is rendered
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
        // Fetching the city model data of the selected city = [ coords, public transport routes ]
        // GET /api/city-model/<selected-city>
        fetch('http://localhost:5000/api/city-model/' + this.props.storage.selectedCity)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw response;

            })
            .then(data => {
                // Grouping the route types together, each type contains an array of route names, for example: 'metro' : ['A', 'B', 'C']
                Object.keys(data["availablePublicTransportRoutes"]).map((t) => (this.routeTypesGrouped)[t] = Object.keys(data["availablePublicTransportRoutes"][t]))
                // Storing the center coordinates of the selected city into the local storage
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