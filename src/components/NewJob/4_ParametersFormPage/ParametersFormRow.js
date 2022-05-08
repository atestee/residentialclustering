import { Component, React } from "react";
import { FormControl, InputAdornment, TextField } from "@mui/material";


export class ParametersFormRow extends Component {
    render() {
        return (
            <FormControl key={ this.props.rowId }>
                <div className="parameters-form-page__form-control">
                    <label className="parameters-form-page__label">{ this.props.label }</label>
                    <TextField
                        className="parameters-form-page__text-field"
                        id={ this.props.rowId }
                        key={ this.props.rowKey }
                        error={this.props.wasBlurred[this.props.rowId]}
                        onBlur={ this.props.handlers.handleBlur.bind(this) }
                        onChange={ this.props.handlers.handleChange.bind(this) }
                        InputProps={ {
                            endAdornment: (this.props.endAdornment === null) ? null :
                                <InputAdornment position="end">{this.props.endAdornment}</InputAdornment>,
                        } }
                    />
                </div>
            </FormControl>
        )
    }
}