import { Component } from "react";
import { Button } from "@mui/material";
import './DetailedViz.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {Heatmap} from "../../Map/Heatmap";
import {IncludedExcludedMap} from "../../Map/IncludedExcludedMap";
import {BarChart, LineChart, Line, Bar} from 'recharts';

export class DetailedViz extends Component {
    data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            shownMap: "heatMap",
            metricsDrawerOpen: true
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    setShownMap(event) {
        this.setState((state) => ({
            shownMap: event.target.value
        }))
    }

    handleClickOnMetricsButton() {
        this.setState((state) => ({
            metricsDrawerOpen: !state.metricsDrawerOpen
        }))
    }

    render() {
        return (
            <div className="detailed-viz">
                <div className="detailed-viz__header">
                    <h2>Detailed Visualization (Cluster { this.props.clusterId })</h2>
                    <div className="detailed-viz__header__buttons">
                        <Button variant="outlined" className="detailed-viz__header__button" onClick={this.props.showHighLevelViz}>Back</Button>
                        <Button variant="outlined" className="detailed-viz__header__button" onClick={this.handleClickOnMetricsButton.bind(this)}>
                            <span className="detailed-viz__header__button__span">Details </span>
                            <FontAwesomeIcon icon={faBars}/>
                        </Button>
                    </div>
                </div>
                <div className="detailed-viz__body">
                    <div className="detailed-viz__body__map-div">
                        {this.state.shownMap === "heatMap" ?
                            <Heatmap centerCoords={ JSON.parse(this.props.storage.getItem("centerCoords"))} setShownMap={this.setShownMap.bind(this)}/> :
                            <IncludedExcludedMap centerCoords={ JSON.parse(this.props.storage.getItem("centerCoords")) } setShownMap={this.setShownMap.bind(this)}/>
                        }
                    </div>
                    { this.state.metricsDrawerOpen &&
                        <div className="detailed-viz__body__metrics-div">
                            <h3>Metrics</h3>
                            <BarChart width={300} height={100} data={this.data}>
                                <Bar dataKey="uv" fill="#8884d8" />
                            </BarChart>
                        </div>
                    }
                </div>
            </div>
        )
    }
}