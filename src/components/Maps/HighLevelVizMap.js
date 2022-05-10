import {Component} from "react";
import L from "leaflet";
import '../Visualization/HighLevelViz/HighLevelViz.css'
import {
    FOCUSED_COLOR_BUILDINGS,
    FOCUSED_COLOR_POLYGON,
} from "../Visualization/HighLevelViz/HighLevelViz";

export class HighLevelVizMap extends Component {
    clusterLayer = new L.FeatureGroup();
    jobData = JSON.parse(this.props.storage.getItem("jobData"))["clusters"];
    coords = JSON.parse(JSON.parse(this.props.storage.getItem("jobData"))["parameters"]["centerCoords"]);

    componentDidMount() {
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
        let number_of_clusters_control = L.control({position: 'topleft'});
        number_of_clusters_control.onAdd = function () {
            let div = L.DomUtil.create('div');

            div.innerHTML = '<label id="number_of_clusters_label" >Number of clusters shown</label>' +
                '<input id="number_of_clusters_textfield" value=' + this.props.numberOfShownClusters + '>'

            div.className = "high-level-viz_number-of-clusters-form"
            return div;
        }.bind(this);
        number_of_clusters_control.addTo(this.map);

        document.getElementById("number_of_clusters_textfield").addEventListener("keyup", this.props.handleChange, false);
        document.getElementById("number_of_clusters_textfield").classList.add('high-level-viz_number-of-clusters-form_textfield')
        document.getElementById("number_of_clusters_label").classList.add('high-level-viz_number-of-clusters-form_label')

        this.showClusters();
    }


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

        //https://gis.stackexchange.com/questions/131944/leaflet-marker-mouseover-popup
        this.jobData.slice(0, this.props.numberOfShownClusters).map((res, index) => {
            let clusterPolygon = new L.GeoJSON(res.geography, {
                onEachFeature: this.onEachFeatureWithIndex(index).bind(this)
            })
            let clusterBuildings = new L.GeoJSON(res.includedResidentialBuildings, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, myStyle);
                }
            });

            this.clusterLayer.addLayer(clusterPolygon);
            this.clusterLayer.addLayer(clusterBuildings);

            let busIcon = L.icon({
                iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/1024px-Solid_blue.svg.png',
                iconSize:     [15, 15],
            });

            let clusterStops = res.feedingTransitStops.map((stop) => (
                new L.Marker(
                    [stop.latitude, stop.longitude],
                    {
                        icon: busIcon,
                        interactive: false
                    }
                )
            ))

            clusterStops.map((stop) => {
                this.clusterLayer.addLayer(stop);
                this.props.clusterStops.addLayer(stop);
                return 0;
            })

            this.props.clusterPolygons[res.geography.features[0].properties.name] = clusterPolygon;
            this.props.clusterBuildings[res.geography.features[0].properties.name] = clusterBuildings;

            return this.map
        });
    }

    onEachFeatureWithIndex(index) {
        return function onEachFeature(feature, layer) {
            layer.bindTooltip("<strong>Cluster " + feature.properties.name + "</strong><br> Click to show detailed analysis", {
                direction: "center",
                offset: L.point(0, -20)
            })

            layer.setStyle({
                fillOpacity: 0.4,
                color: FOCUSED_COLOR_POLYGON
            })

            layer.on({
                click: () => {
                    this.props.showDetailedViz(index);
                },
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
        this.map.invalidateSize();
        this.clusterLayer.clearLayers();
        this.showClusters();

    }

    render() {
        return (
            <div id="map"/>
        )
    }
}