import {Button} from "react-bootstrap";
import {React} from "react";

export function Start() {
    return (
        <div>
            <h2>What would you like to do?</h2>
            <Button href={"/city-picker"}>Create new model</Button>{' '}
            <Button href={"/job-management"}>Pick model from database</Button>
        </div>
    );
}