import {Component, React} from "react";
import {Button} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import "./HeaderStyles.css";

// The header for the job overview page
export class HeaderForJobOverview extends Component {
    render() {
        return (
            <div className="header-component">
                <div className="header-component_header">
                    <h2>Residential clustering</h2>
                </div>
                <div className="header-component_buttons">
                    {/* When "start job" is clicked, user is redirected to the city picker page */}
                    <Button component={RouterLink} to={this.props.next} variant="outlined">New Job</Button>
                </div>
            </div>
        )
    }
}