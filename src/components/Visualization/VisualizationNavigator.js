import { useParams } from "react-router-dom";
import {HighLevelViz} from "./HighLevelViz/HighLevelViz";
import {DetailedViz} from "./DetailedViz/DetailedViz";
import testResponse from '../../data/test_response.json'
import {useEffect, useState} from "react";

const HIGH_LEVEL = 0;
const DETAILED = 1;

export function VisualizationNavigator ({storage}) {
    let { jobId } = useParams(); // for the GET request - to receive the analysis data
    let [shownComponent, setShownComponent] = useState(HIGH_LEVEL);
    let [shownClusterId, setShownClusterId] = useState(null);

    useEffect(() => {
    })

    let showHighLevelViz = () => {
        setShownComponent(HIGH_LEVEL);
    };

    let showDetailedViz = (clusterId) => {
        setShownComponent(DETAILED);
        setShownClusterId(clusterId);
    };

    switch (shownComponent) {
        case HIGH_LEVEL:
            return (<HighLevelViz showDetialedViz={showDetailedViz.bind(this)} analysisData={testResponse} storage={storage}/>);
        case DETAILED:
            return (<DetailedViz showHighLevelViz={showHighLevelViz.bind(this)} analysisData={testResponse[{shownClusterId}]} clusterId={shownClusterId} storage={storage}/>);
        default:
            return (<HighLevelViz showDetialedViz={showDetailedViz.bind(this)} analysisData={testResponse} storage={storage}/>);
    }
}