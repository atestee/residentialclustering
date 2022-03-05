import {React, Component} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import {JobManagerPicker} from "./components/JobManagerPicker";
import {CityPicker} from "./components/CityPicker";
import {RoutePicker} from "./components/RoutePicker";
import {CenterPicker} from "./components/CenterPicker";
import {ParametersFormPage} from "./components/ParametersFormPage";


// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('./images/marker-icon-2x.png'),
//     iconUrl: require('./images/marker-icon.png'),
//     shadowUrl: require('./images/marker-shadow.png')
// });


export class App extends Component {
    render () {
        return (
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<CityPicker />}/>
                        <Route path="/new-job/1" element={<CityPicker />}/>
                        <Route path="/new-job/2" element={<RoutePicker />}/>
                        <Route path="/new-job/3" element={<CenterPicker />}/>
                        <Route path="/new-job/4" element={<ParametersFormPage />}/>
                        <Route path="/job-management" element={<JobManagerPicker />}/>
                    </Routes>
                </div>
            </Router>
        )
    }

}

// function Map() {
//     useEffect(() => {
//         console.log(boundary)
//         let map = L.map('map', {
//             center: [50.07501157760184, 14.416865286199549],
//             zoom: 13,
//             layers: [
//                 L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/{id}/{z}/{x}/{y}.png', {
//                     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
//                     maxZoom: 18,
//                     id: 'toner-lite',
//                     tileSize: 512,
//                     zoomOffset: -1
//                 }),
//             ],
//             preferCanvas: true
//         });
//
//         let myStyle = {
//             radius : 3,
//             fillColor : "rgba(243,225,5,0.76)",
//             color : "rgba(243,225,5,0.76)",
//             weight : 1,
//             opacity : 0.1,
//             fillOpacity : 0.8
//         };
//
//         L.geoJSON(destinations, {
//             pointToLayer: function (feature, latlng) {
//                 return L.circleMarker(latlng, myStyle);
//             }
//         }).addTo(map);
//         L.geoJSON(boundary).addTo(map);
//         console.log(map);
//     });
//
//     return <div id={"map"}></div>;
// }

