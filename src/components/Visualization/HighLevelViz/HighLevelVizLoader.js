import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import {HighLevelViz} from "./HighLevelViz";

export function HighLevelVizLoader ({storage}) {
    let { jobId } = useParams();
    let navigate = useNavigate();
    let [jobData, setJobData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/job/" + jobId)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw response;

            })
            .then((data) => {
                storage.setItem("jobId", jobId)
                setJobData(data);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            })
    }, [jobId, jobData, storage])

    if (jobData) {
        return (<HighLevelViz storage={storage} jobData={jobData} navigate={navigate}/>);
    } else {
        return (
            <div style={{ display: "flex", height: "100vh"}}>
                <CircularProgress size={100} style={{ margin: "auto" }}/>
            </div>
        )
    }
}