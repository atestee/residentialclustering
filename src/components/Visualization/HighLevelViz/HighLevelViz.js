import {Component} from "react";
import L from "leaflet";

import './HighLevelViz.css'
import { Tab, Tabs, Box } from "@mui/material";
import { TabPanel } from "../../MaterialUI/TabPanel";
import { A11yProps } from "../../MaterialUI/A11yProps";
import {HighLevelVizMap} from "../../Maps/HighLevelVizMap";
import {HeaderForHighLevelVisualization} from "../../Headers/HeaderForHighLevelVisualization";
import "./HighLevelViz.css";
import {getRouteColor} from "../../getRouteColor";

export const FOCUSED_COLOR_POLYGON = "#1976d2"
export const UNFOCUSED_COLOR_POLYGON = "#76b0e8"
export const FOCUSED_COLOR_BUILDINGS = "rgba(243,225,5,1)"

// The high-level visualization implementation
export class HighLevelViz extends Component {
    map = null
    clusterPolygons = {}
    clusterBuildings = {}
    clusterStops = new L.FeatureGroup()
    clustersData = this.props.jobData.clusters
    jobId = this.props.jobData.jobId
    parameters = this.props.jobData.parameters
    // The geometry and color data for visualizing the route corresponding the calculated clusters
    routesLinestrings = this.clustersData.map((cluster) => ({
        "geometry": cluster["routeGeometry"],
        "color": getRouteColor(cluster["routeType"], cluster["routeName"])
    }))

    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            numberOfShownClusters: this.clustersData.length,
            value: 0,
            metricsDrawerOpen: false,
        }
    }
    // Handle change in the text input controlling how many clusters are shown
    handleNumberOfClustersChange(event){
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

    // Showing only the focused cluster, others invisible
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

    // Showing the focused cluster with a more saturated color
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
    // Make all clusters visible and set their color to the focused one
    removeFocus() {
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
        this.props.storage.setItem("clusterData", JSON.stringify(this.clustersData[clusterIdx]))
        this.props.storage.setItem("nbins", JSON.stringify(this.props.jobData["nbins"]))
        this.props.storage.setItem("parameters", JSON.stringify(this.props.jobData["parameters"]))
        this.props.storage.setItem("centerCoords", JSON.stringify(this.props.jobData["centerCoords"]))

        this.props.navigate("/jobs/" + this.props.storage.getItem("jobId") + "/" + clusterIdx)
    }

    render() {
        return (
            <div className={"high-level-viz"}>
                <HeaderForHighLevelVisualization back={"/"} handleClickOnMetricsButton={this.handleClickOnMetricsButton.bind(this)} jobName={this.props.jobData["jobName"]}/>
                <div className="high-level-viz_body">
                    <div className="high-level-viz_map-div">
                        <HighLevelVizMap
                            storage={this.props.storage}
                            jobData={this.props.jobData}
                            handleChange={ this.handleNumberOfClustersChange.bind(this) }
                            showDetailedViz={ this.showDetailedViz.bind(this) }
                            numberOfShownClusters={ this.state.numberOfShownClusters }
                            clusterPolygons={ this.clusterPolygons }
                            clusterBuildings={ this.clusterBuildings }
                            clusterStops={this.clusterStops}
                            putFocusOnCluster={ this.putFocusOnCluster_HighlightCluster }
                            removeFocus={this.removeFocus}
                            routeLinestrings={this.routesLinestrings}
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
                                    <div className="high-level-viz_metrics-tabpanel">
                                        <TabPanel value={this.state.value} index={0} >
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
                                    </div>
                                    <div className="high-level-viz_metrics-tabpanel">
                                        <TabPanel value={this.state.value} index={1}>
                                            <div>
                                                {
                                                    // Only show the data for the chosen number of clusters
                                                    this.clustersData.slice(0, this.state.numberOfShownClusters).map((res, index) => (
                                                        <div className="high-level-viz_metrics-div high-level-viz_metrics-div__clickable"
                                                             key={res.geography.features[0].properties.name + "-numberOfIncludedResidents"}
                                                             onMouseEnter={() => {
                                                                 this.putFocusOnCluster_OnlyOneCluster(res.geography.features[0].properties.name)
                                                             }}
                                                             onMouseLeave={() => {
                                                                 this.removeFocus()
                                                             }}
                                                             onClick={ () => {this.showDetailedViz(index).bind(this)}}
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
                                    </div>
                                    <div className="high-level-viz_metrics-tabpanel">
                                        <TabPanel value={this.state.value} index={2}>
                                            <div>
                                                {
                                                    // Only show the data for the chosen number of clusters
                                                    this.clustersData.slice(0, this.state.numberOfShownClusters).map((res, index) => (
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
                                                                {(res.metrics.totalClusterAreaInMeters / 1000000).toFixed(2).toLocaleString()} km<sup>2</sup>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </TabPanel>
                                    </div>
                                </Box>
                            </div>
                        </div>
                    }
                </div>
            </div>

        )
    }


}