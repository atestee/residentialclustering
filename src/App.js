import {React, Component} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import {JobManagerPicker} from "./components/JobManagement/JobManagerPicker";
import {CityPicker} from "./components/CityPicker/CityPicker";
import {RoutePicker} from "./components/RoutePicker/RoutePicker";
import {CenterPicker} from "./components/CenterPicker/CenterPicker";
import {ParametersFormPage} from "./components/ParametersFormPage/ParametersFormPage";
import {HighLevelViz} from "./components/Visualization/HighLevelViz/HighLevelViz";
import {DetailedViz} from "./components/Visualization/DetailedViz/DetailedViz";
import {VisualizationNavigator} from "./components/Visualization/VisualizationNavigator";

export class App extends Component {
    myStorage = window.localStorage;

    render () {
        return (
            <Router>
                <div>
                    <Routes>
                        {/*<Route path="/" element={<HighLevelViz storage={this.myStorage} />}/>*/}
                        {/*<Route path="/detailed-visualization" element={<DetailedViz storage={this.myStorage} />}/>*/}
                        <Route path="/new-job/1" element={<CityPicker storage={this.myStorage} />} />
                        <Route path="/new-job/2" element={<RoutePicker storage={this.myStorage} />} />
                        <Route path="/new-job/3" element={<CenterPicker storage={this.myStorage} />} />
                        <Route path="/new-job/4" element={<ParametersFormPage storage={this.myStorage} />} />
                        <Route path="/job-management" element={<JobManagerPicker storage={this.myStorage} />} />
                        <Route path="/jobs/:jobId" element={<VisualizationNavigator storage={this.myStorage} />} />
                    </Routes>
                </div>
            </Router>
        )
    }

}

