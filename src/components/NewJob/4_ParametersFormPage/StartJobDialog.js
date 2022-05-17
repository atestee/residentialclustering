import {useNavigate} from "react-router-dom";
import {Button, Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {React} from "react";

// source: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
export async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export function StartJobDialog({handleClose, showStartJobDialog, inputData, setProceedClickedTrue}) {
    let navigate = useNavigate();

    function handleClickOnProceed() {
        setProceedClickedTrue()
        postData('http://localhost:5000/api/job', inputData)
            .then((response) => {
                if (response.jobId) {
                    return response;
                }
                throw response;

            })
            .then(() => {
                navigate("/")
            })
            .catch((error) => {
                console.error("Error fetching data: " + error.toString());
            })
    }

    return (
        <Dialog
            open={showStartJobDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Are you sure want to start the job?
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                            <span>
                                After starting the job the input data will be deleted and you will be directed to the main page.
                                The calculation may take a few minutes.
                            </span>
                <div className="parameters-form-page__dialog__buttons">
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    <Button variant="outlined" onClick={handleClickOnProceed}>Proceed</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}