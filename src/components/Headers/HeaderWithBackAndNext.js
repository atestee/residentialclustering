import {Component, React} from "react";
import {Button} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import "./HeaderStyles.css";


export class HeaderWithBackAndNext extends Component {
    render() {
        return (
            <div className="header-component">
                <div className="header-component_header">
                    <h2>Residential clustering</h2>
                </div>
                <div className="header-component_buttons">
                    <Button component={RouterLink} to={this.props.back} className="header-component_buttons_back-button" variant="outlined">Back</Button>
                    <Button disabled={this.props.nextIsDisabled} component={RouterLink} to={this.props.next} variant="outlined">Next</Button>
                </div>
            </div>
        )
    }
}