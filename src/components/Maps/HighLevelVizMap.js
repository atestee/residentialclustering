import {Component} from "react";
import L from "leaflet";
import '../Visualization/HighLevelViz/HighLevelViz.css'
import {
    FOCUSED_COLOR_BUILDINGS,
    FOCUSED_COLOR_POLYGON,
} from "../Visualization/HighLevelViz/HighLevelViz";

// The map component for the high-level visualization page
export class HighLevelVizMap extends Component {
    // ClusterLayer stores the polygon, res.buildings and route stop geojson layers for each cluster
    clusterLayer = new L.FeatureGroup();
    // Cluster data from the job result
    clustersData = this.props.jobData.clusters
    // Center coordinates of the analysed city
    coords = JSON.parse(this.props.jobData["centerCoords"])

    componentDidMount() {
        // Map component initialization
        this.map = L.map("map", {
            center: this.coords,
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
        });
        this.map.zoomControl.setPosition('bottomleft');
        this.map.addLayer(this.clusterLayer);


        // The text field control for declaring how many clusters should be shown in the map
        let number_of_clusters_control = L.control({position: 'topleft'});
        number_of_clusters_control.onAdd = function () {
            let div = L.DomUtil.create('div');
            div.innerHTML = '<label id="number_of_clusters_label" >Number of clusters shown</label>' +
                '<input id="number_of_clusters_textfield" value=' + this.props.numberOfShownClusters + '>'
            div.className = "high-level-viz_number-of-clusters-form"
            return div;
        }.bind(this);
        number_of_clusters_control.addTo(this.map);
        // handling change of input
        document.getElementById("number_of_clusters_textfield").addEventListener("keyup", this.props.handleChange, false);
        document.getElementById("number_of_clusters_textfield").classList.add('high-level-viz_number-of-clusters-form_textfield')
        document.getElementById("number_of_clusters_label").classList.add('high-level-viz_number-of-clusters-form_label')


        // Each cluster corresponds to a set of public transport stop, the route these stops are operating on is shown in the map
        // this.routesGeojson includes all routes from all calculated clusters
        this.routesGeojson = {
            "type": "FeatureCollection",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": []
        };
        let routeNames = []
        this.props.routeLinestrings.map((route) => {
            // In order to not visualize one route multiple time, we check if it has already been included in routeNames
            if (!routeNames.includes(route.name)) {
                routeNames.push(route.name)
                this.routesGeojson.features.push(
                    {
                        "type": "Feature",
                        "properties": {
                            "color": route.color
                        },
                        "geometry": route.geometry
                    }
                )
            }
            return 0
        })
        this.routesGeoJsonLayer = new L.GeoJSON(this.routesGeojson, {
            style: function(feature) {
                return {color: feature.properties.color}
            }
        });
        this.routesGeoJsonLayer.addTo(this.map)

        this.showClusters();
    }

    // When the cursor is hovered over a cluster:
    //      - the hovered-over cluster polygon is shown with a more saturated color than the other polygons
    //      - a tooltip with the hovered-over cluster name is shown
    //      - the included residential buildings inside the hovered-over cluster are shown in yellow and the rest is not shown
    // When the cursor is not hovered over a cluster:
    //      - all clusters are shown in the same color
    //      - all the included residential buildings are shown in yellow
    //      - and no tooltip is shown
    // When cluster is clicked, the user is redirected to the detailed visualization page for this cluster
    showClusters() {
        let myStyle = {
            radius : 3,
            fillColor : FOCUSED_COLOR_BUILDINGS,
            color : FOCUSED_COLOR_BUILDINGS,
            weight : 1,
            opacity : 1,
            fillOpacity : 1,
            interactive: false
        };

        // Only showing the amount of clusters that is set by the text input control
        this.clustersData.slice(0, this.props.numberOfShownClusters).map((res, index) => {
            // ClusterPolygon = the GeoJSON layer for the cluster polygon
            let clusterPolygon = new L.GeoJSON(res.geography, {
                // defines what happens when polygon is hovered over or clicked
                onEachFeature: this.onEachFeatureWithIndex(index).bind(this)
            })
            // ClusterBuildings = the GeoJSON layer for the cluster included buildings
            let clusterBuildings = new L.GeoJSON(res.includedResidentialBuildings, {
                // each point is drawn on the map as a circle (L.CircleMarker)
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, myStyle);
                }
            });
            // Adding the cluster polygon layer and included buildings layer to the clusterLayer feature group
            this.clusterLayer.addLayer(clusterPolygon);
            this.clusterLayer.addLayer(clusterBuildings);

            // Saving clusterPolygon and clusterBuildings into variables from the parent component HighLevelViz
            this.props.clusterPolygons[res.geography.features[0].properties.name] = clusterPolygon;
            this.props.clusterBuildings[res.geography.features[0].properties.name] = clusterBuildings;

            // Blue icon representing the public transportation routes
            let stopIcon = L.icon({
                iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/1024px-Solid_blue.svg.png',
                iconSize:     [15, 15],
            });
            // The cluster stops markers
            let clusterStops = res.feedingTransitStops.map((stop) => (
                new L.Marker(
                    [stop.latitude, stop.longitude],
                    {
                        icon: stopIcon,
                        interactive: false
                    }
                )
            ))
            clusterStops.map((stop) => {
                this.clusterLayer.addLayer(stop);
                this.props.clusterStops.addLayer(stop);
                return 0;
            })

            return this.map
        });
    }

    onEachFeatureWithIndex(index) {
        return function onEachFeature(feature, layer) {
            // Tooltip with the cluster's name, shown when hovered over cluster
            layer.bindTooltip("<strong>Cluster " + feature.properties.name + "</strong><br> Click to show detailed analysis", {
                direction: "center",
                offset: L.point(0, -20)
            })
            // Style of focused cluster
            layer.setStyle({
                fillOpacity: 0.4,
                color: FOCUSED_COLOR_POLYGON
            })
            layer.on({
                // Handling clicking on a cluster in the map
                click: () => {
                    this.props.showDetailedViz(index);
                },
                // Handling hovering over a cluster in the map
                mouseover: function () {
                    this.props.putFocusOnCluster(feature.properties.name)
                }.bind(this),
                mouseout: function () {
                    this.props.removeFocus()
                }.bind(this)
            });
        }.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.map.invalidateSize(); // when the map size changes, the map is centered

        // Updating the cluster GeoJSON layers
        this.clusterLayer.clearLayers();
        this.showClusters();

    }

    render() {
        return (
            <div id="map"/>
        )
    }
}