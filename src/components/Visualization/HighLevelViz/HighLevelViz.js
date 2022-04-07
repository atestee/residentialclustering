import {Component, createRef} from "react";
import L from "leaflet";

import './HighLevelViz.css'
import { Tab, Tabs, Box, Button } from "@mui/material";
import { TabPanel } from "../../mui/TabPanel";
import { A11yProps } from "../../mui/A11yProps";
import { control } from "leaflet/dist/leaflet-src.esm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import {HighLevelVizMap} from "../../Map/HighLevelVizMap";

export class HighLevelViz extends Component {
    map = null
    clusterLayer = new L.FeatureGroup()
    clusterPolygons = {}
    focusedColor = "#1976d2"
    unfocusedColor = "#76b0e8"
    testResponse = this.props.analysisData;

    constructor(props) {
        super(props);
        this.mapRef = createRef();
        this.state = {
            redirect: null,
            numberOfShownClusters: this.testResponse.length,
            value: 0,
            metricsDrawerOpen: false,
        }
    }

    componentDidMount() {
        this.map = this.mapRef.current.map;
    }

    handleChange(event){
        if (event.target.value !== "") {
            this.setState((state) => ({
                numberOfShownClusters: event.target.value
            }))
        }
    }

    handleTabChange(event, newValue) {
        this.setState((state) => ({
            value: newValue
        }))
    }

    handleClickOnMetricsButton() {
        this.setState((state) => ({
            metricsDrawerOpen: !state.metricsDrawerOpen
        }))
    }

    putFocusOnCluster(clusterName) {
        // change color of focused cluster - optional
        let cluster = this.clusterPolygons[clusterName]
        cluster.setStyle({
            color: this.focusedColor
        })
        cluster.bringToFront()

        // make other clusters invisible
        Object.keys(this.clusterPolygons).map((key) => {
            if (key !== clusterName) {
                this.clusterPolygons[key].setStyle({
                    fill: false,
                    stroke: false
                })
            }
            return key
        })
    }

    removeFocusFromCluster(clusterName) {
        // make all clusters visible and set their color to the unfocused one
        Object.values(this.clusterPolygons).map((cluster) => (
            cluster.setStyle({
                color: this.focusedColor,
                fill: true,
                stroke: true
            })
        ))
    }

    render() {
        return (
            <div className={"high-level-viz"}>
                <div className="high-level-viz_header-div ">
                    <h2 className="high-level-viz_header-div_header">High Level Visualization</h2>
                    <div className="high-level-viz_header-div_metrics-button">
                        <Button
                            style={{padding: "5 8", minWidth: 32}}
                            variant={"outlined"}
                            onClick={this.handleClickOnMetricsButton.bind(this)}
                        >
                            <span style={{marginRight: 8}}>Details </span>
                            <FontAwesomeIcon icon={faBars}/>
                        </Button>
                    </div>
                </div>
                <div className="high-level-viz_body">
                    <div className="high-level-viz_map-div">
                        <HighLevelVizMap
                            ref={ this.mapRef }
                            centerCoords={ JSON.parse(this.props.storage.getItem("centerCoords")) }
                            handleChange={ this.handleChange.bind(this) }
                            showDetailedViz={ this.props.showDetialedViz }
                            analysisData={ this.props.analysisData }
                            numberOfShownClusters={ this.state.numberOfShownClusters }
                            clusterPolygons={ this.clusterPolygons }
                        />
                    </div>
                    { this.state.metricsDrawerOpen &&
                        <div className="high-level-viz_drawer">
                            <div className={"high-level-viz_tabs"}>
                                <Box sx={{width: '100%'}}>
                                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                        <Tabs
                                            value={this.state.value}
                                            onChange={this.handleTabChange.bind(this)}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            // aria-label="basic tabs example"
                                            aria-label="scrollable auto tabs example"
                                        >
                                            <Tab className="high-level-viz_metrics-tab"
                                                 label="Parameters" {...A11yProps(0)} />
                                            <Tab className="high-level-viz_metrics-tab"
                                                 label="Reached residents" {...A11yProps(1)} />
                                            <Tab className="high-level-viz_metrics-tab"
                                                 label="Reached area" {...A11yProps(2)} />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={this.state.value} index={0}>
                                        <div className="high-level-viz_metrics-div">
                                            <div className="high-level-viz_metrics-div_label">Minimal walking
                                                distance:
                                            </div>
                                            <div className="high-level-viz_metrics-div_value">400m</div>
                                            <div className="high-level-viz_metrics-div_label">Maximal driving
                                                time:
                                            </div>
                                            <div className="high-level-viz_metrics-div_value">30min</div>
                                            <div className="high-level-viz_metrics-div_label">Maximal driving
                                                distance:
                                            </div>
                                            <div className="high-level-viz_metrics-div_value">3500m</div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <div>
                                            {
                                                this.testResponse.map((res) => (
                                                    <div className="high-level-viz_metrics-div"
                                                         key={res.geography.features[0].properties.name + "-numberOfIncludedResidents"}
                                                         onMouseEnter={() => {
                                                             this.putFocusOnCluster(res.geography.features[0].properties.name)
                                                         }}
                                                         onMouseLeave={() => {
                                                             this.removeFocusFromCluster(res.geography.features[0].properties.name)
                                                         }}
                                                    >
                                                        <div className="high-level-viz_metrics-div_label"
                                                             key={res.geography.features[0].properties.name + "-label"}
                                                        >
                                                            {res.geography.features[0].properties.name}
                                                        </div>
                                                        <div className="high-level-viz_metrics-div_value"
                                                             key={res.geography.features[0].properties.name + "-value"}>
                                                            {Math.round(res.metrics.numberOfIncludedResidents).toLocaleString()}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={2}>
                                        <div>
                                            {
                                                this.testResponse.map((res) => (
                                                    <div className="high-level-viz_metrics-div"
                                                         key={res.geography.features[0].properties.name + "-totalClusterArea"}
                                                         onMouseEnter={() => {
                                                             this.putFocusOnCluster(res.geography.features[0].properties.name)
                                                         }}
                                                         onMouseLeave={() => {
                                                             this.removeFocusFromCluster(res.geography.features[0].properties.name)
                                                         }}
                                                    >
                                                        <div className="high-level-viz_metrics-div_label"
                                                             key={res.geography.features[0].properties.name + "-label"}
                                                             onMouseEnter={() => {
                                                                 this.putFocusOnCluster(res.geography.features[0].properties.name)
                                                             }}
                                                             onMouseLeave={() => {
                                                                 this.removeFocusFromCluster(res.geography.features[0].properties.name)
                                                             }}
                                                        >
                                                            {res.geography.features[0].properties.name}
                                                        </div>
                                                        <div className="high-level-viz_metrics-div_value"
                                                             key={res.geography.features[0].properties.name + "-value"}>
                                                            {Math.round(res.metrics.totalCluster).toLocaleString()} km<sup>2</sup>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </TabPanel>
                                </Box>
                            </div>
                        </div>
                    }
                </div>
            </div>

        )
    }


}