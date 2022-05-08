import {React, Component} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import {JobManagement} from "./components/JobManagement/JobManagement";
import {CityPicker} from "./components/NewJob/1_CityPicker/CityPicker";
import {CenterPicker} from "./components/NewJob/3_CenterPicker/CenterPicker";
import {ParametersFormPage} from "./components/NewJob/4_ParametersFormPage/ParametersFormPage";
import {RoutePickerDataLoader} from "./components/NewJob/2_RoutePicker/RoutePickerDataLoader";
import {DetailedViz} from "./components/Visualization/DetailedViz/DetailedViz";
import {HighLevelVizLoader} from "./components/Visualization/HighLevelViz/HighLevelVizLoader";

export class App extends Component {
    myStorage = window.localStorage;

    render () {
        return (
            <Router>
                <div>
                    <Routes>
                        <Route path="/new-job/1" element={<CityPicker storage={this.myStorage} />} />
                        <Route path="/new-job/2" element={<RoutePickerDataLoader storage={this.myStorage} />} />
                        <Route path="/new-job/3" element={<CenterPicker storage={this.myStorage} />} />
                        <Route path="/new-job/4" element={<ParametersFormPage storage={this.myStorage} />} />
                        <Route path="/" element={<JobManagement storage={this.myStorage} />} />
                        <Route path="/jobs/:jobId" element={<HighLevelVizLoader storage={this.myStorage}/>} />
                        <Route path="/jobs/:jobId/:clusterIdx" element={<DetailedViz storage={this.myStorage}/>} />
                    </Routes>
                </div>
            </Router>
        )
    }

}

