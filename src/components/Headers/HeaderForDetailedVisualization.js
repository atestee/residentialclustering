import { React} from "react";
import {Button} from "@mui/material";
import "./HeaderStyles.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";


export function HeaderForDetailedVisualization({storage, clusterName, handleClickOnMetricsButton}) {
    let navigate = useNavigate();

    function handleClickOnBack() {
        navigate("/jobs/" + storage.getItem("jobId"))
    }

    return (
        <div className="header-component">
            <div className="header-component_header">
                <h2>Detailed Visualization ({ clusterName })</h2>
            </div>
            <div className="header-component_buttons">
                <Button variant="outlined" className="detailed-viz__header__button" onClick={handleClickOnBack}>Back</Button>
                <Button variant="outlined" className="detailed-viz__header__button" onClick={handleClickOnMetricsButton}>
                    <span className="detailed-viz__header__button__span">Details </span>
                    <FontAwesomeIcon icon={faBars}/>
                </Button>
            </div>
        </div>
    )
}