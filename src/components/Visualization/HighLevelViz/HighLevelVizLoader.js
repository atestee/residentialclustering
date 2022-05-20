import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import {HighLevelViz} from "./HighLevelViz";

// A wrapper component for the high level viz component
// Fetches job result data from the server
// Before the data is loaded, a circular progress is rendered
// After the data is loaded, the high-level visualization page is rendered
export function HighLevelVizLoader ({storage}) {
    let { jobId } = useParams();
    let navigate = useNavigate();
    let [jobData, setJobData] = useState(null);

    // Fetching job result data from server
    // GET /api/jobs/<jobId>
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