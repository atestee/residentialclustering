import {Component, React} from "react";
import L from "leaflet";

import './HighLevelViz.css'
import testResponse from '../../data/test_response.json'
import {Navigate} from "react-router-dom";
import {FormControl, TextField, Tab, Tabs, Box} from "@mui/material";
import {TabPanel} from "../mui/TabPanel";
import {A11yProps} from "../mui/A11yProps";

export class HighLevelViz extends Component {
    map = null
    clusterLayer = new L.FeatureGroup()
    clusterPolygons = {}
    focusedColor = "#1976d2"
    unfocusedColor = "#76b0e8"

    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            numberOfShownClusters: 3,
            value: 0
        }
    }

    componentDidMount() {
        // let layer = L.StamenTileLayer("toner")
        this.map = L.map("high-level-viz-map", {
            center: [50.08804, 14.42076],
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

        this.map.addLayer(this.clusterLayer)

        // let myStyle = {
        //     radius : 3,
        //     fillColor : "rgba(243,225,5,0.76)",
        //     color : "rgba(243,225,5,0.76)",
        //     weight : 1,
        //     opacity : 0.1,
        //     fillOpacity : 0.8
        // };

        //https://gis.stackexchange.com/questions/131944/leaflet-marker-mouseover-popup
        testResponse.map((res) => {
            let clusterPolygon = new L.GeoJSON(res["geography"], {
                onEachFeature: this.onEachFeature.bind(this)
            })
            this.clusterLayer.addLayer(clusterPolygon)

            this.clusterPolygons[res.geography.features[0].properties.name] = clusterPolygon

            // L.geoJSON(JSON.parse(res.includedResidentialBuildings), {
            //     pointToLayer: function (feature, latlng) {
            //         return L.circleMarker(latlng, myStyle);
            //     }
            // }).addTo(this.map);

            return this.map
        })

        // console.log(Object.keys(this.clusterPolygons))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.clusterLayer.clearLayers()

        // let myStyle = {
        //     radius : 3,
        //     fillColor : "rgba(243,225,5,0.76)",
        //     color : "rgba(243,225,5,0.76)",
        //     weight : 1,
        //     opacity : 0.1,
        //     fillOpacity : 0.8
        // };

        //https://gis.stackexchange.com/questions/131944/leaflet-marker-mouseover-popup
        testResponse.slice(0, this.state.numberOfShownClusters).map((res) => {

            // polygons
            let clusterPolygon = new L.GeoJSON(res.geography, {
                onEachFeature: this.onEachFeature.bind(this)
            })
            this.clusterLayer.addLayer(clusterPolygon)
            this.clusterPolygons[res.geography.features[0].properties.name] = clusterPolygon

            // residential buildings - points
            // L.geoJSON(JSON.parse(res.includedResidentialBuildings), {
            //     pointToLayer: function (feature, latlng) {
            //         return L.circleMarker(latlng, myStyle);
            //     }
            // }).addTo(this.map);

            return this.map
        })
    }

    onEachFeature(feature, layer) {
        layer.bindTooltip("<strong>Cluster " + feature.properties.name + "</strong><br> Click to show detailed analysis", {
            direction: "center",
            offset: L.point(0, -20)
        })

        layer.setStyle({
            fillOpacity: 0.4,
            color: this.focusedColor
        })

        layer.on({
            click: () => {
                console.log("cluster " + feature.id + " clicked!")
                this.setState((state) => ({
                    redirect: "/detailed-visualization"
                }))
            },
            mouseover: function (e) {
                layer.bringToFront();

                // set the opacity of other cluster to a lower value and set the color to a brighter one
                Object.keys(this.clusterPolygons).map((key) => {
                    if (key !== feature.properties.name) {
                        this.clusterPolygons[key].setStyle({
                            opacity: 0.1,
                            color: this.unfocusedColor
                        })
                    }
                    return key
                })
            }.bind(this),
            mouseout: function (e) {

                // reset values
                Object.values(this.clusterPolygons).map((cluster) => (
                    cluster.setStyle({
                        color: this.focusedColor,
                        opacity: 1
                    })
                ))
            }.bind(this)
        });
    }

    handleChange(event){
        this.setState((state) => ({
            numberOfShownClusters: event.target.value
        }))
    }

    handleTabChange(event, newValue) {
        this.setState((state) => ({
            value: newValue
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
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }
        return (
            <div className={"high-level-viz"}>
                <h2 className="high-level-viz_header">High Level Visualization</h2>
                <div className={"high-level-viz_body"}>
                    <div>
                        <FormControl>
                            <div className="high-level-viz_number-of-clusters-form">
                                <label className="high-level-viz_number-of-clusters-form_label">Number of clusters shown</label>
                                <TextField
                                    className="high-level-viz_number-of-clusters-form_textfield"
                                    id='number-of-clusters'
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.numberOfShownClusters}
                                />
                            </div>
                        </FormControl>
                        <div className="high-level-viz_map-div">
                            <div id={"high-level-viz-map"}></div>
                        </div>
                    </div>
                    <div className={"high-level-viz_tabs"}>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={this.state.value}
                                    onChange={this.handleTabChange.bind(this)}
                                    centered={true}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    // aria-label="basic tabs example"
                                    aria-label="scrollable auto tabs example"
                                >
                                    <Tab className="high-level-viz_metrics-tab" label="Parameters" {...A11yProps(0)} />
                                    <Tab className="high-level-viz_metrics-tab" label="Reached residents" {...A11yProps(1)} />
                                    <Tab className="high-level-viz_metrics-tab" label="Reached area" {...A11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.value} index={0}>
                                <div className="high-level-viz_metrics-div">
                                    <div className="high-level-viz_metrics-div_label">Minimal walking distance:</div>
                                    <div className="high-level-viz_metrics-div_value">400m</div>
                                    <div className="high-level-viz_metrics-div_label">Maximal driving time:</div>
                                    <div className="high-level-viz_metrics-div_value">30min</div>
                                    <div className="high-level-viz_metrics-div_label">Maximal driving distance:</div>
                                    <div className="high-level-viz_metrics-div_value">3500m</div>
                                </div>
                            </TabPanel>
                            <TabPanel value={this.state.value} index={1}>
                                <div>
                                    {
                                        testResponse.map((res) => (
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
                                                <div className="high-level-viz_metrics-div_value" key={res.geography.features[0].properties.name + "-value"}>
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
                                        testResponse.map((res) => (
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
                                                <div className="high-level-viz_metrics-div_value" key={res.geography.features[0].properties.name + "-value"}>
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
            </div>

        )
    }
}