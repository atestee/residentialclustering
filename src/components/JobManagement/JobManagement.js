import {Component, React} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import {Link as RouterLink} from "react-router-dom";
import "./JobManagement.css";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle, IconButton,
    TableFooter,
    TablePagination
} from "@mui/material";
import {HeaderWithNewJob} from "../Headers/HeaderWithNewJob";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

export class JobManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "jobs": null,
            detailsToggled: false,
            detailsParams: null,
            page: 0,
            rowsPerPage: 5
        }
    }

    componentDidMount() {
        fetch("http://localhost:5000/api/job-information")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then((data) => {
                this.setState({"jobs": data})
                this.emptyRows = this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - data.length) : 0;
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            })
    }

    handleChangePage = (event, newPage) => {
        this.setState({page: newPage})
    };

    handleChangeRowsPerPage(event) {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        })
    };

    showDetails(job) {
        console.log(job.parameters.numberOfPTStopsClustering)
        this.setState({
            detailsToggled: true,
            detailsParams: job["parameters"]
        })
    }

    handleClose() {
        console.log("close details")
        this.setState({
            detailsToggled: false
        })
    }

    render() {
        if (this.state.jobs) {
            return (
                <div>
                    <HeaderWithNewJob next="/new-job/1"/>
                    <div className="job-management__body">
                        <div className="job-management__body__table">
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow key="table-row">
                                            <TableCell>Job name</TableCell>
                                            <TableCell>Start time</TableCell>
                                            <TableCell>End time</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(this.state.rowsPerPage > 0
                                                ? this.state.jobs.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                                                : this.state.jobs
                                        ).map((job) => (
                                            <TableRow
                                                key={job.jobId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {job.jobName}
                                                </TableCell>
                                                <TableCell>{job.startTime}</TableCell>
                                                <TableCell>{job.endTime}</TableCell>
                                                <TableCell>{job.status}</TableCell>
                                                <TableCell align="right">
                                                    <Button variant="outlined" style={{"marginRight": 8}} onClick={() => this.showDetails(job)}>Details</Button>
                                                    <Button variant="outlined" component={RouterLink} to={"/jobs/" + job.jobId}>Show</Button>
                                                </TableCell>
                                            </TableRow>

                                        ))}
                                        {this.emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * this.emptyRows }}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
                                                colSpan={3}
                                                count={this.state.jobs.length}
                                                rowsPerPage={this.state.rowsPerPage}
                                                page={this.state.page}
                                                SelectProps={{
                                                    inputProps: {
                                                        'aria-label': 'rows per page',
                                                    },
                                                    native: true,
                                                }}
                                                onPageChange={this.handleChangePage.bind(this)}
                                                onRowsPerPageChange={this.handleChangeRowsPerPage.bind(this)}
                                                ActionsComponent={TablePaginationActions}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </div>
                        {this.state.detailsToggled &&
                            <Dialog
                                open={this.state.detailsToggled}
                                onClose={this.handleClose.bind(this)}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    Details
                                    <IconButton
                                        aria-label="close"
                                        onClick={this.handleClose.bind(this)}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            color: (theme) => theme.palette.grey[500],
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </DialogTitle>
                                <DialogContent>
                                    <div className="job-management__body__details">
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    <TableRow key="minWalkingDistance">
                                                        <TableCell align="left">Minimal walking distance (meters):</TableCell>
                                                        <TableCell
                                                            align="right">{this.state.detailsParams.minWalkingDistanceMeters}</TableCell>
                                                    </TableRow>
                                                    <TableRow key="maxDrivingDistance">
                                                        <TableCell align="left">Maximal driving distance (meters):</TableCell>
                                                        <TableCell
                                                            align="right">{this.state.detailsParams.maxDrivingDistanceMeters}</TableCell>
                                                    </TableRow>
                                                    <TableRow key="maxDrivingDuration">
                                                        <TableCell align="left">Maximal driving duration (minutes):</TableCell>
                                                        <TableCell
                                                            align="right">{this.state.detailsParams.maxTaxiRideDurationMinutes}</TableCell>
                                                    </TableRow>
                                                    {this.state.detailsParams.numberOfPTStopsClustering.map((type) => (
                                                        <TableRow key={"numberOfPTStopsClustering-" + type.transitType}>
                                                            <TableCell align="left">Number of stops in corridor ({type.transitType}):</TableCell>
                                                            <TableCell
                                                                align="right">{type.numberOfStops}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        }
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{ display: "flex", height: "100vh"}}>
                    <CircularProgress size={100} style={{ margin: "auto" }}/>
                </div>
            )
        }

    }
}