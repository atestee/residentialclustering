import {Component, React} from "react";
import {Button} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import "./HeaderStyles.css";

// The header component for the parameters form page
export class HeaderWithBackAndStartJob extends Component {
    render() {
        return (
            <div className="header-component">
                <div className="header-component_header">
                    <h2>Residential clustering</h2>
                </div>
                <div className="header-component_buttons">
                    {/* When "back" is clicked, user is redirected to the center picker page */}
                    <Button component={RouterLink} to={this.props.back} className="header-component_buttons_back-button" variant="outlined">Back</Button>
                    {/* When "next" is clicked, a dialog component shows up */}
                    <Button disabled={this.props.startJobButtonIsDisabled} component={RouterLink} to={this.props.next} variant="outlined" onClick={this.props.handleStartJob}>Start Job</Button>
                </div>
            </div>
        )
    }
}