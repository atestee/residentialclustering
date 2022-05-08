import { useParams } from "react-router-dom";
import {HighLevelViz} from "./HighLevelViz/HighLevelViz";
import {DetailedViz} from "./DetailedViz/DetailedViz";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";

const HIGH_LEVEL = 0;
const DETAILED = 1;

export function VisualizationNavigator ({storage}) {
    let { jobId } = useParams(); // for the GET request - to receive the analysis data
    let [shownComponent, setShownComponent] = useState(HIGH_LEVEL);
    let [shownCluster, setShownCluster] = useState(null);
    let [shownClusterName, setShownClusterName] = useState(null);
    let [shownClusterIdx, setShownClusterIdx] = useState(null);
    let [jobData, setJobData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/finished-job/" + jobId)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw response;

            })
            .then((data) => {
                setJobData(data)
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            })
    }, [jobId])

    let showHighLevelViz = () => {
        setShownComponent(HIGH_LEVEL);
    };

    let showDetailedViz = (clusterIdx, clusterName) => {
        setShownClusterIdx(clusterIdx);
        setShownClusterName(clusterName);
        setShownCluster(jobData["clusters"][clusterIdx]);
        setShownComponent(DETAILED);
    };


    if (jobData) {
        switch (shownComponent) {
            case HIGH_LEVEL:
                return (<HighLevelViz showDetailedViz={showDetailedViz.bind(this)} analysisData={jobData["clusters"]} parameters={jobData["parameters"]} storage={storage}/>);
            case DETAILED:
                return (<DetailedViz showHighLevelViz={showHighLevelViz.bind(this)} clusterData={shownCluster} parameters={jobData["parameters"]} clusterId={shownClusterIdx} clusterName={shownClusterName} storage={storage}/>);
            default:
                return (<HighLevelViz showDetailedViz={showDetailedViz.bind(this)} analysisData={jobData} parameters={jobData["parameters"]} storage={storage}/>);
        }
    } else {
        return (
            <div style={{ display: "flex", height: "100vh"}}>
                <CircularProgress size={100} style={{ margin: "auto" }}/>
            </div>
        )
    }

}