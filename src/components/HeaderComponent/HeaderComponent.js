import {Component, React} from "react";
import {Button} from "@mui/material";

export class HeaderComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="header-component">
                <div className="header-component_header">
                    <h2>Residential clustering</h2>
                </div>
                <div className="header-component_buttons">
                    <Button className="header-component_buttons_back-button" variant="outlined" href={this.props.back}>Back</Button>
                    {
                        this.props.startJobButton ?
                            <Button variant="outlined" href={this.props.next}>Start Job</Button> :
                            <Button variant="outlined" href={this.props.next}>Next</Button>
                    }
                </div>
            </div>
        )
    }
}