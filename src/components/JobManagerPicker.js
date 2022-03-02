import {React, useState} from "react";
import {Button, Table} from "react-bootstrap";

export function JobManagerPicker() {
    let [name, setName] = useState(null);
    let [distWalk, setDistWalk] = useState(null);
    let [distDrive, setDistDrive] = useState(null);
    let [city, setCity] = useState(null);
    let [selected, setSelected] = useState(null);

    function handleClickDetails(name, distWalk, distDrive, city){
        setName(name);
        setDistWalk(distWalk);
        setDistDrive(distDrive);
        setCity(city);
        document.getElementById("selected-model-details").style.display = "block";
    }

    function handleClickSelect(name){
        setSelected(name);
        document.getElementById("selected-model").style.display = "block";
    }

    return (
        <div>
            <h2>Pick an already calculated model</h2>
            <Table striped hover>
                <thead>
                <tr>
                    <th>City</th>
                    <th>Distance (walking)</th>
                    <th>Distance (driving)</th>
                    <th>Name</th>
                    <th> </th>
                    <th> </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Prague</td>
                    <td>300m</td>
                    <td>4km</td>
                    <td>Prague clustering analysis 1</td>
                    <td><Button variant="outline-primary" onClick={() => handleClickDetails("Prague clustering analysis 1", "300m", "4k", "Prague")}>Details</Button></td>
                    <td><Button variant="outline-primary" onClick={() => handleClickSelect("Prague clustering analysis 1")}>Select</Button></td>
                </tr>
                <tr>
                    <td>Prague</td>
                    <td>200m</td>
                    <td>6km</td>
                    <td>Prague clustering analysis 2</td>
                    <td><Button variant="outline-primary" onClick={() => handleClickDetails("Prague clustering analysis 2", "200m", "6k", "Prague")}>Details</Button></td>
                    <td><Button variant="outline-primary" onClick={() => handleClickSelect("Prague clustering analysis 2")}>Select</Button></td>
                </tr>
                <tr>
                    <td>Prague</td>
                    <td>200m</td>
                    <td>6km</td>
                    <td>Prague clustering analysis 3</td>
                    <td><Button variant="outline-primary" onClick={() => handleClickDetails("Prague clustering analysis 3", "200m", "6k", "Prague")}>Details</Button></td>
                    <td><Button variant="outline-primary" onClick={() => handleClickSelect("Prague clustering analysis 3")}>Select</Button></td>
                </tr>
                <tr>
                    <td>Prague</td>
                    <td>200m</td>
                    <td>6km</td>
                    <td>Prague clustering analysis 4</td>
                    <td><Button variant="outline-primary" onClick={() => handleClickDetails("Prague clustering analysis 4", "200m", "6k", "Prague")}>Details</Button></td>
                    <td><Button variant="outline-primary" onClick={() => handleClickSelect("Prague clustering analysis 4")}>Select</Button></td>
                </tr>
                <tr>
                    <td>Prague</td>
                    <td>200m</td>
                    <td>6km</td>
                    <td>Prague clustering analysis 5</td>
                    <td><Button variant="outline-primary" onClick={() => handleClickDetails("Prague clustering analysis 5", "200m", "6k", "Prague")}>Details</Button></td>
                    <td><Button variant="outline-primary" onClick={() => handleClickSelect("Prague clustering analysis 5")}>Select</Button></td>
                </tr>
                </tbody>
            </Table>
            <div id="selected-model-details" style = {{display : `none`}}>
                <h3>Details: </h3>
                <div style = {{borderWidth: `1px`,borderStyle: `solid`, backgroundColor: `lightskyblue`}}>
                    Name: {name} <br/>
                    City: {city} <br/>
                    Walking distance: {distWalk} <br/>
                    Driving distance: {distDrive}
                </div>
            </div>
            <br/>
            <div id="selected-model" style = {{display : `none`}}>
                <h3>Selected:</h3> {selected}
            </div>
            <br/>
            <Button href={"/"}>Back</Button>{' '}
            <Button>Next</Button>
        </div>
    );
}