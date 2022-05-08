import {Component, React} from "react";
import {Button} from "@mui/material";
import "./HeaderStyles.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";


export class HeaderForHighLevelVisualization extends Component {
    render() {
        return (
            <div className="header-component">
                <div className="header-component_header">
                    <h2>Detailed Visualization ({ this.props.clusterName })</h2>
                </div>
                <div className="header-component_buttons">
                    <Button variant="outlined" className="detailed-viz__header__button" onClick={this.props.showHighLevelViz}>Back</Button>
                    <Button variant="outlined" className="detailed-viz__header__button" onClick={this.props.handleClickOnMetricsButton}>
                        <span className="detailed-viz__header__button__span">Details </span>
                        <FontAwesomeIcon icon={faBars}/>
                    </Button>
                </div>
            </div>
        )
    }
}