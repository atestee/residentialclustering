import {Component, React} from "react";
import {FormControl, InputAdornment, TextField} from "@mui/material";
import './ParametersFormPage.css';
import selectedTypes from '../../data/selectedTypes.json'
import {HeaderComponent} from "../HeaderComponent/HeaderComponent";

export class ParametersFormPage extends Component {
    render() {
        return (
            <div>
                <HeaderComponent back="/new-job/3" next="/new-job/4" startJobButton={true}/>
                <div>
                    <form>
                        <div className="parameters-form-page__form">
                            {/* Job name */}
                            <FormControl>
                                <div className="parameters-form-page__form-control">
                                    <label className="parameters-form-page__label">Job name</label>
                                    <TextField className="parameters-form-page__text-field" id='job-name'/>
                                </div>
                            </FormControl>

                            {/* Minimal walking distance */}
                            <FormControl>
                                <div className="parameters-form-page__form-control">
                                    <label className="parameters-form-page__label">Minimal walking distance</label>
                                    <TextField
                                        className="parameters-form-page__text-field"
                                        id = 'min-walking-distance'
                                        InputProps = {{
                                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                        }}
                                    />
                                </div>
                            </FormControl>

                            {/* Maximal driving distance */}
                            <FormControl>
                                <div className="parameters-form-page__form-control">
                                    <label className="parameters-form-page__label">Maximal driving distance</label>
                                    <TextField
                                        className="parameters-form-page__text-field"
                                        id = 'max-driving-distance'
                                        InputProps = {{
                                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                        }}
                                    />
                                </div>
                            </FormControl>

                            {/* Maximal driving time */}
                            <FormControl>
                                <div className="parameters-form-page__form-control">
                                    <label className="parameters-form-page__label">Maximal driving time</label>
                                    <TextField
                                        className="parameters-form-page__text-field"
                                        id = 'max-driving-distance'
                                        InputProps = {{
                                            endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                                        }}
                                    />
                                </div>
                            </FormControl>

                            {/*Number of stops in corridors*/}
                            {
                                selectedTypes.selectedTypesArray.map((type) => (
                                    <FormControl>
                                        <div className="parameters-form-page__form-control">
                                            <label className="parameters-form-page__label">Number of stops in corridor [{type}]</label>
                                            <TextField
                                                className="parameters-form-page__text-field"
                                                id = 'number-of-steps-in-corridor'
                                            />
                                        </div>
                                    </FormControl>
                                ))
                            }
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}