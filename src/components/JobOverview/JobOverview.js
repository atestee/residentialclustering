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
import "./JobOverview.css";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle, IconButton,
    TablePagination
} from "@mui/material";
import {HeaderWithNewJob} from "../Headers/HeaderWithNewJob";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

// component for the Job Overview Page (also the main page)
// path: '/'
export class JobOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobInformation: null, // job information data saved here after being fetched from the server
            detailsToggled: false, // when true the details dialog will show up
            detailsParams: null, // job numerical parameters, shown in the dialog
            page: 0, // current shown page in the table pagination
            rowsPerPage: 5 // current shown number of rows in the table pagination
        }
    }

    componentDidMount() {
        // GET request for the job information data [{ job name, start time, end time, status, parameters }]
        fetch("http://localhost:5000/api/job-information")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then((data) => {
                // setState causes the component to update its modified children
                this.setState({jobInformation: data})
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            })
    }

    // changing the page in the table pagination
    handleChangePage = (event, newPage) => {
        this.setState({page: newPage})
    };

    // changing the number of rows in the table pagination
    handleChangeRowsPerPage(event) {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        })
    };

    // after details button clicked, this causes the details dialog to open up
    showDetails(job) {
        this.setState({
            detailsToggled: true,
            detailsParams: job["parameters"]
        })
    }

    // closing the details dialog
    handleDialogClose() {
        this.setState({
            detailsToggled: false
        })
    }

    render() {
        // if the job information data was already loaded show the page, else show circular progress
        if (this.state.jobInformation) {
            return (
                <div>
                    {/* Header component for this page */}
                    <HeaderWithNewJob next="/new-job/1"/>
                    <div className="job-management__body">
                        {/* Job Information Table */}
                        <div className="job-management__body__table">
                            <TableContainer sx={{ maxHeight: "80vh" }} component={Paper} >
                                <Table stickyHeader aria-label="sticky table">
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
                                                ? this.state.jobInformation.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                                                : this.state.jobInformation
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
                                                    <Button disabled={job.status === "RUNNING"} variant="outlined" component={RouterLink} to={"/jobs/" + job.jobId}>Show</Button>
                                                </TableCell>
                                            </TableRow>

                                        ))}
                                        <TableRow key="table-pagination">
                                            <TablePagination
                                                rowsPerPageOptions={[1, 5, 10, 20, { label: 'All', value: -1 }]}
                                                count={this.state.jobInformation.length}
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
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        {/* Details dialog */}
                        {this.state.detailsToggled &&
                            <Dialog
                                open={this.state.detailsToggled}
                                onClose={this.handleDialogClose.bind(this)}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    Details
                                    <IconButton
                                        aria-label="close"
                                        onClick={this.handleDialogClose.bind(this)}
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
                // Circular progress
                <div style={{ display: "flex", height: "100vh"}}>
                    <CircularProgress size={100} style={{ margin: "auto" }}/>
                </div>
            )
        }

    }
}