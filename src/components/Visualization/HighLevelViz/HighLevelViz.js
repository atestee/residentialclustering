import {Component} from "react";
import L from "leaflet";

import './HighLevelViz.css'
import { Tab, Tabs, Box } from "@mui/material";
import { TabPanel } from "../../mui/TabPanel";
import { A11yProps } from "../../mui/A11yProps";
import {HighLevelVizMap} from "../../Maps/HighLevelVizMap";
import {HeaderForHighLevelVisualization} from "../../Headers/HeaderForHighLevelVisualization";
import "./HighLevelViz.css";

export const FOCUSED_COLOR_POLYGON = "#1976d2"
export const UNFOCUSED_COLOR_POLYGON = "#76b0e8"
export const FOCUSED_COLOR_BUILDINGS = "rgba(243,225,5,1)"
// export const FOCUSED_COLOR_BUILDINGS = "rgb(77,208,215)"


export class HighLevelViz extends Component {
    map = null
    clusterLayer = new L.FeatureGroup()
    clusterPolygons = {}
    clusterBuildings = {}
    clusterStops = new L.FeatureGroup()
    jobData = JSON.parse(this.props.storage.getItem("jobData"))["clusters"];
    // jobId = JSON.parse(this.props.storage.getItem("jobId"));
    // jobData = this.props.storage.getItem("jobData");
    jobId = this.props.storage.getItem("jobId");
    parameters = JSON.parse(this.props.storage.getItem("jobData"))["parameters"];

    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            numberOfShownClusters: this.jobData.length,
            value: 0,
            metricsDrawerOpen: false,
        }
    }

    componentDidMount() {
        console.log(this.jobData)
    }

    handleChange(event){
        if (event.target.value !== "") {
            this.setState(() => ({
                numberOfShownClusters: event.target.value
            }))
        }
    }

    handleTabChange(event, newValue) {
        this.setState(() => ({
            value: newValue
        }))
    }

    handleClickOnMetricsButton() {
        this.setState((state) => ({
            metricsDrawerOpen: !state.metricsDrawerOpen
        }))
    }

    // only shows the focused cluster, others invisible
    putFocusOnCluster_OnlyOneCluster(clusterName) {
        // make other clusters invisible
        Object.keys(this.clusterPolygons).map((key) => {
            if (key !== clusterName) {
                this.clusterPolygons[key].setStyle({
                    fill: false,
                    stroke: false
                })
                this.clusterBuildings[key].setStyle({
                    fill: false,
                    stroke: false
                })
            }
            return key
        })
    }

    // show focused cluster with more saturated color
    putFocusOnCluster_HighlightCluster(clusterName) {
        let polygon = this.clusterPolygons[clusterName];
        let buildings = this.clusterBuildings[clusterName];

        polygon.bringToFront();
        buildings.bringToFront();

        // set the opacity of other cluster to a lower value and set the color to a brighter one
        Object.keys(this.clusterPolygons).map((key) => {
            if (key !== clusterName) {
                this.clusterPolygons[key].setStyle({
                    opacity: 0.1,
                    color: UNFOCUSED_COLOR_POLYGON
                })
                this.clusterBuildings[key].setStyle({
                    fill: false,
                    stroke: false
                })
            }
            return key
        })
    }

    removeFocus() {
        // make all clusters visible and set their color to the focused one
        Object.values(this.clusterPolygons).map((polygon) => (
            polygon.setStyle({
                color: FOCUSED_COLOR_POLYGON,
                fill: true,
                opacity: 1,
                stroke: true,
            })
        ))

        Object.values(this.clusterBuildings).map((buildings) => (
            buildings.setStyle({
                fill: true,
                stroke: true
            })
        ))

        this.clusterStops.bringToFront()
    }

    showDetailedViz(clusterIdx) {
        this.props.storage.setItem("clusterIdx", clusterIdx)
        this.props.navigate("/jobs/" + this.props.storage.getItem("jobId") + "/" + clusterIdx)
    }

    render() {
        return (
            <div className={"high-level-viz"}>
                <HeaderForHighLevelVisualization back={"/"} handleClickOnMetricsButton={this.handleClickOnMetricsButton.bind(this)}/>
                <div className="high-level-viz_body">
                    <div className="high-level-viz_map-div">
                        <HighLevelVizMap
                            storage={this.props.storage}
                            centerCoords={ JSON.parse(this.props.storage.getItem("centerCoords")) }
                            handleChange={ this.handleChange.bind(this) }
                            showDetailedViz={ this.showDetailedViz.bind(this) }
                            analysisData={ this.props.analysisData }
                            numberOfShownClusters={ this.state.numberOfShownClusters }
                            clusterPolygons={ this.clusterPolygons }
                            clusterBuildings={ this.clusterBuildings }
                            clusterStops={this.clusterStops}
                            putFocusOnCluster={ this.putFocusOnCluster_HighlightCluster }
                            removeFocus={this.removeFocus}
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
                                            <div className="high-level-viz_metrics-div_value">{this.parameters.minWalkingDistanceMeters} m</div>
                                            <div className="high-level-viz_metrics-div_label">Maximal driving
                                                time:
                                            </div>
                                            <div className="high-level-viz_metrics-div_value">{this.parameters.maxTaxiRideDurationMinutes} minutes</div>
                                            <div className="high-level-viz_metrics-div_label">Maximal driving
                                                distance:
                                            </div>
                                            <div className="high-level-viz_metrics-div_value">{this.parameters.maxDrivingDistanceMeters} m</div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <div>
                                            {
                                                this.jobData.map((res, index) => (
                                                    <div className="high-level-viz_metrics-div high-level-viz_metrics-div__clickable"
                                                         key={res.geography.features[0].properties.name + "-numberOfIncludedResidents"}
                                                         onMouseEnter={() => {
                                                             this.putFocusOnCluster_OnlyOneCluster(res.geography.features[0].properties.name)
                                                         }}
                                                         onMouseLeave={() => {
                                                             this.removeFocus()
                                                         }}
                                                         onClick={ () => {
                                                             this.showDetailedViz(index).bind(this)
                                                         }}
                                                    >
                                                        <div className="high-level-viz_metrics-div_label"
                                                             key={res.geography.features[0].properties.name + "-label"}
                                                        >
                                                            {res.geography.features[0].properties.name}
                                                        </div>
                                                        <div className="high-level-viz_metrics-div_value"
                                                             key={res.geography.features[0].properties.name + "-value"}>
                                                            {Math.round(res.metrics.numberOfIncludedResidents)} residents
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={2}>
                                        <div>
                                            {
                                                this.jobData.map((res, index) => (
                                                    <div className="high-level-viz_metrics-div high-level-viz_metrics-div__clickable"
                                                         key={res.geography.features[0].properties.name + "-totalClusterArea"}
                                                         onMouseEnter={() => {
                                                             this.putFocusOnCluster_OnlyOneCluster(res.geography.features[0].properties.name)
                                                         }}
                                                         onMouseLeave={() => {
                                                             this.removeFocus()
                                                         }}
                                                         onClick={ () => {
                                                             this.props.showDetailedViz(index)
                                                         }}
                                                    >
                                                        <div className="high-level-viz_metrics-div_label"
                                                             key={res.geography.features[0].properties.name + "-label"}
                                                             onMouseEnter={() => {
                                                                 this.putFocusOnCluster_OnlyOneCluster(res.geography.features[0].properties.name)
                                                             }}
                                                             onMouseLeave={() => {
                                                                 this.removeFocus()
                                                             }}
                                                        >
                                                            {res.geography.features[0].properties.name}
                                                        </div>
                                                        <div className="high-level-viz_metrics-div_value"
                                                             key={res.geography.features[0].properties.name + "-value"}>
                                                            {(res.metrics.totalClusterArea / 1000000).toFixed(2).toLocaleString()} km<sup>2</sup>
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