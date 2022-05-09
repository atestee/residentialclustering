import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import {HighLevelViz} from "./HighLevelViz";

export function HighLevelVizLoader ({storage}) {
    let { jobId } = useParams();
    let navigate = useNavigate();
    let [jobData, setJobData] = useState(null);

    useEffect(() => {
        if (!storage.hasOwnProperty("jobData") || (storage.hasOwnProperty("jobId") && storage.getItem("jobId") !== jobId)) {
            fetch("http://localhost:5000/api/finished-job/" + jobId)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw response;

                })
                .then((data) => {
                    storage.setItem("jobId", jobId);
                    storage.setItem("jobData", JSON.stringify(data))
                    setJobData(data);
                })
                .catch((error) => {
                    console.error("Error fetching data: " + error);
                })
        } else {
            setJobData(JSON.parse(storage.getItem("jobData")));
        }
    }, [jobId, storage])

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