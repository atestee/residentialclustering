import {Component, React} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Checkbox, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './RoutePicker.css'
import {HeaderWithBackAndNext} from "../../Headers/HeaderWithBackAndNext";
import {RoutePickerMap} from "../../Maps/RoutePickerMap";
import {getRouteColor} from "../../getRouteColor";

export class RoutePicker extends Component {
    routeTypesGrouped = this.props.routeTypesGrouped;
    map = null;

    constructor(props) {
        super(props);
        this.routesGeojson = this.props.storage.hasOwnProperty("routesGeoJson") ? JSON.parse(this.props.storage.routesGeoJson) : {
            "type": "FeatureCollection",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": []
        };



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
            }
        }
    }

    componentDidUpdate(){
        this.props.storage.setItem("routesGeoJson", JSON.stringify(this.routesGeojson))
        this.props.storage.setItem("isCheck", JSON.stringify(this.state.isCheck))
        this.props.storage.setItem("isCheckAll", JSON.stringify(this.state.isCheckAll))
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

            this.updateRoutesGeojson(newIsCheck)

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

            this.updateRoutesGeojson(newIsCheck)

            return {
                isCheckAll: newIsCheckAll,
                isCheck: newIsCheck
            };
        });
    }

    handleExpand(routeType) {
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
                            "color" : getRouteColor(routeType, route)
                        },
                        "geometry": this.props.availableRoutes[routeType][route]
                    }
                )
            ))
        ))


    }

    render() {
        let zeroRoutesChosen = [].concat.apply([], Object.values(this.state.isCheck)).length === 0

        return (
            <div>
                <HeaderWithBackAndNext nextIsDisabled={zeroRoutesChosen} back="/new-job/1" next="/new-job/3"/>
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
                        <RoutePickerMap
                            centerCoords={JSON.parse(this.props.storage.getItem("centerCoords"))}
                            routesGeojson={this.routesGeojson}
                        />
                    </div>
                </div>
            </div>
        )
    }
}