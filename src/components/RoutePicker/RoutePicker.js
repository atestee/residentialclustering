import {Component, React, createRef} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Checkbox, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './RoutePicker.css'
import routes from "../../data/routes.json"
import L from "leaflet";
import {HeaderComponent} from "../HeaderComponent/HeaderComponent";
import { MyMap } from "../Map/MyMap";

export class RoutePicker extends Component {
    routeTypesGrouped = {};
    map = null;
    routesGeojsonLayer = null;

    routesGeojson = {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": []
    }

    constructor(props) {
        super(props);
        this.mapRef = createRef();
        this.state = {
            isCheckAll: (this.props.storage.hasOwnProperty("isCheckAll")) ? JSON.parse(this.props.storage.isCheckAll) : {
                "tram": false,
                "metro": false,
                "bus": false,
                "funicular": false
            },
            isCheck: (this.props.storage.hasOwnProperty("isCheck")) ? JSON.parse(this.props.storage.isCheck) : {
                "tram": [],
                "metro": [],
                "bus": [],
                "funicular": []
            },
            isExpanded: {
                "tram": false,
                "metro": false,
                "bus": false,
                "funicular": false
            },
            routes: null
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
                    routes: data["availablePublicTransportRoutes"]
                })
            });
    }

    componentDidUpdate(){
        this.map = this.mapRef.current.map

        this.props.storage.setItem("isCheck", JSON.stringify(this.state.isCheck))
        this.props.storage.setItem("isCheckAll", JSON.stringify(this.state.isCheckAll))

        this.updateRoutesGeojson(this.state.isCheck)

        if (this.routesGeojsonLayer !== null) {
            this.map.removeLayer(this.routesGeojsonLayer);
        }

        if (this.routesGeojson.features.length > 0) {
            this.routesGeojsonLayer = new L.GeoJSON(this.routesGeojson, {
                style: function(feature) {
                    return {color: feature.properties.color};
                }
            });
            this.routesGeojsonLayer.addTo(this.map);
        }

        this.props.storage.setItem("routesGeoJson", JSON.stringify(this.routesGeojson))
    }

    getColor(type, name) {
        if (type === "metro") {
            if (name === "A") {
                return "#19B619"
            } else if (name === "B") {
                return "#dcda43"
            } else if (name === "C") {
                return "#FF0000"
            }
        } else {
            if (type === "tram"){
                return "#07b7e1"
            } else if (type === "bus"){
                return "#FF8000"
            } else {
                return "#C800FF"
            }
        }
    }

    handleSelectAllClick(routeTypeName) {
        this.setState((state) => {
            let newIsCheckAll = { ...state.isCheckAll };
            let newIsCheck = { ...state.isCheck };
            newIsCheckAll[routeTypeName] = !state.isCheckAll[routeTypeName];

            if (newIsCheckAll[routeTypeName]) {
                newIsCheck[routeTypeName] = this.routeTypesGrouped[routeTypeName];
            } else {
                newIsCheck[routeTypeName] = [];
            }

            return {
                isCheckAll: newIsCheckAll,
                isCheck: newIsCheck
            };
        });
    }

    handleClick(routeName, routeType){
        this.setState((state) => {
            let newIsCheck = { ...this.state.isCheck };
            let newIsCheckAll = { ...this.state.isCheckAll };

            if (!state.isCheck[routeType].includes(routeName)) {
                // click
                newIsCheck[routeType] = [...newIsCheck[routeType], routeName];
                // if last route in route group was clicked
                if (newIsCheck[routeType].length === this.routeTypesGrouped[routeType].length) {
                    newIsCheckAll[routeType] = true;
                }

            } else {
                // unclick
                newIsCheck[routeType] = [...newIsCheck[routeType].filter(route => route !== routeName)];
                newIsCheckAll[routeType] = false;
            }

            return {
                isCheckAll: newIsCheckAll,
                isCheck: newIsCheck
            };
        });
    }

    handleExpand(routeType) {
        this.setState()
        this.setState((state) => {
            let newIsExpanded = {...state.isExpanded};

            if (newIsExpanded[routeType]) {
                newIsExpanded[routeType] = false;
            } else {
                Object.keys(newIsExpanded).map(k => newIsExpanded[k] = false);
                newIsExpanded[routeType] = true;
            }

            return {
                isExpanded: newIsExpanded
            };
        });

    }

    updateRoutesGeojson(isCheck) {
        this.routesGeojson.features = [];
        Object.keys(isCheck).map((routeType) => (
            isCheck[routeType].map((route) => (
                this.routesGeojson.features.push(
                    {
                        "type": "Feature",
                        "properties": {
                            "route_name" : route,
                            "route_type" : routeType,
                            "color" : this.getColor(routeType, route)
                        },
                        "geometry": {
                            "type": "LineString",
                            "coordinates": routes[routeType][route]
                        }
                    }
                )
            ))
        ))
    }

    render() {
        // flatten the array of arrays of chosen routes
        let zeroRoutesChosen = [].concat.apply([], Object.values(this.state.isCheck)).length === 0

        return (
            <div>
                <HeaderComponent nextIsDisabled={zeroRoutesChosen} back="/new-job/1" next="/new-job/3"/>
                <h3 style={ { marginBottom: 16, marginLeft: 16 } }>Choose analysed public transport routes (select at least one route)</h3>
                <div className="route-picker">
                    <div className="route-picker_dropdown-div">
                        <div>
                            {
                                Object.keys(this.routeTypesGrouped).map((routeTypeName) => (
                                    <Accordion className="route-picker_accordion" key={ routeTypeName } onChange={() => this.handleExpand(routeTypeName)} expanded={this.state.isExpanded[routeTypeName]}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography className="route-picker_accordion_accordionName">{routeTypeName}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className="route-picker_accordion_accordionDetails">
                                            {Object.keys(this.routeTypesGrouped[routeTypeName]).length > 1 &&
                                                <div>
                                                    <Checkbox style={{ padding: 0}} onClick={() => this.handleSelectAllClick(routeTypeName)} checked={this.state.isCheckAll[routeTypeName]}/>
                                                    { !this.state.isCheckAll[routeTypeName] ? 'Select All' : 'Unselect All' }
                                                </div>
                                            }
                                            <div className="route-picker_accordion_expanded">
                                                {
                                                    Object.values(this.routeTypesGrouped[routeTypeName]).map((route) => (
                                                        <div className="route-picker_accordion_expanded_checkboxes" key={ routeTypeName + ' ' + route }>
                                                            {route} <Checkbox onChange={() => this.handleClick(route, routeTypeName)} checked={this.state.isCheck[routeTypeName].includes(route)} />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                            }
                        </div>
                    </div>
                    <div className="route-picker_map-div">
                        <MyMap
                            ref={this.mapRef}
                            centerCoords={JSON.parse(this.props.storage.getItem("centerCoords"))}
                            selectedRoutes={JSON.parse(this.props.storage.getItem("routesGeoJson"))}
                        />
                    </div>
                </div>
            </div>
        )
    }
}