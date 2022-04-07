import {Component, createRef} from "react";
import {MyMap} from "./MyMap";
import L from "leaflet";
import '../Visualization/HighLevelViz/HighLevelViz.css'


export class HighLevelVizMap extends Component {
    clusterLayer = new L.FeatureGroup();
    focusedColor = "#1976d2"
    unfocusedColor = "#76b0e8"
    testResponse = this.props.analysisData;

    constructor(props) {
        super(props);
        this.mapRef = createRef();
    }

    componentDidMount() {
        this.map = this.mapRef.current.map;
        this.map.zoomControl.setPosition('bottomleft');
        this.map.addLayer(this.clusterLayer);
        let number_of_clusters_control = L.control({position: 'topleft'});
        number_of_clusters_control.onAdd = function (map) {
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

        // let myStyle = {
        //     radius : 3,
        //     fillColor : "rgba(243,225,5,0.76)",
        //     color : "rgba(243,225,5,0.76)",
        //     weight : 1,
        //     opacity : 0.1,
        //     fillOpacity : 0.8
        // };

        this.showClusters();
    }

    showClusters() {
        //https://gis.stackexchange.com/questions/131944/leaflet-marker-mouseover-popup
        this.testResponse.slice(0, this.props.numberOfShownClusters).map((res) => {

            // polygons
            let clusterPolygon = new L.GeoJSON(res.geography, {
                onEachFeature: this.onEachFeature.bind(this)
            })
            this.clusterLayer.addLayer(clusterPolygon)
            this.props.clusterPolygons[res.geography.features[0].properties.name] = clusterPolygon

            // residential buildings - points
            // L.geoJSON(JSON.parse(res.includedResidentialBuildings), {
            //     pointToLayer: function (feature, latlng) {
            //         return L.circleMarker(latlng, myStyle);
            //     }
            // }).addTo(this.map);

            return this.map
        });
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
                // console.log("cluster " + feature.id + " clicked!")
                console.log("cluster " + feature.properties.name + " clicked!")
                this.props.showDetailedViz(feature.properties.name);
            },
            mouseover: function (e) {
                layer.bringToFront();

                // set the opacity of other cluster to a lower value and set the color to a brighter one
                Object.keys(this.props.clusterPolygons).map((key) => {
                    if (key !== feature.properties.name) {
                        this.props.clusterPolygons[key].setStyle({
                            opacity: 0.1,
                            color: this.unfocusedColor
                        })
                    }
                    return key
                })
            }.bind(this),
            mouseout: function (e) {

                // reset values
                Object.values(this.props.clusterPolygons).map((cluster) => (
                    cluster.setStyle({
                        color: this.focusedColor,
                        opacity: 1
                    })
                ))
            }.bind(this)
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.map.invalidateSize();
        this.clusterLayer.clearLayers();
        this.showClusters();
    }

    render(){
        return(
            <MyMap
                ref={ this.mapRef }
                centerCoords={ this.props.centerCoords }
            />
        )
    }
}