import {Component, React} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './RoutePicker.css'
import routes from "../data/routes.json"
import L from "leaflet";

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
        this.state = {
            isCheckAll: {
                "tram": false,
                "metro": false,
                "bus": false,
                "funicular": false
            },
            isCheck: {
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
            }
        }

        Object.keys(routes).map((t) => (this.routeTypesGrouped)[t] = Object.keys(routes[t]))
    }

    componentDidMount() {
        this.map = L.map('map', {
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
            preferCanvas: true
        })
    }

    componentDidUpdate(){
        this.updateRoutesGeojson(this.state.isCheck)

        console.log(this.state.isCheck);
        console.log(this.routesGeojson);

        if (this.routesGeojsonLayer !== null) {
            console.log("a")
            console.log(this.map.hasLayer(this.routesGeojsonLayer))
            this.map.removeLayer(this.routesGeojsonLayer);
            console.log(this.map.hasLayer(this.routesGeojsonLayer))
        }

        if (this.routesGeojson.features.length > 0) {
            this.routesGeojsonLayer = new L.GeoJSON(this.routesGeojson, {
                style: function(feature) {
                    return {color: feature.properties.color};
                }
            });
            this.routesGeojsonLayer.addTo(this.map);
        }
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
                newIsCheck[routeType] = [...newIsCheck[routeType], routeName];
            } else {
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
        this.setState((state) => {
            let newIsExpanded = {...this.state.isExpanded};

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
        return (
            <div className="mainDiv">
                <h2 className="header">Route picker</h2>
                <div className="buttons">
                    <Button className="buttonBack" variant="outlined" href={"/new-job/1"}>Back</Button>
                    <Button variant="outlined" href={"/new-job/3"}>Next</Button>
                </div>
                <div className="inputDiv">
                    <div className="accordionsColumn">
                        <div>
                            {
                                Object.keys(this.routeTypesGrouped).map((routeTypeName) => (
                                    <Accordion className="accordion" key={ routeTypeName } onChange={() => this.handleExpand(routeTypeName)} expanded={this.state.isExpanded[routeTypeName]}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography className="accordionName">{routeTypeName}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className="accordionDetails">
                                            {Object.keys(this.routeTypesGrouped[routeTypeName]).length > 1 &&
                                                <div>
                                                    <Checkbox style={{ padding: 0}} onClick={() => this.handleSelectAllClick(routeTypeName)} checked={this.state.isCheckAll[routeTypeName]}/>
                                                    { !this.state.isCheckAll[routeTypeName] ? 'Select All' : 'Unselect All' }
                                                </div>
                                            }
                                            <div className="row">
                                                {
                                                    Object.values(this.routeTypesGrouped[routeTypeName]).map((route) => (
                                                        <div className="columnCheckboxes" key={ routeTypeName + ' ' + route }>
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
                    <div className="mapColumn">
                        <div id={"map"}></div>
                    </div>
                </div>
            </div>
        )
    }
}