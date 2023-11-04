import {Alert, Snackbar} from "@mui/material";
import React from "react";

const Dialog = ({open, closeErrorDialog, message, severity}) => {
    const severityValues = ["success", "info", "warning", "error"];
    if (severityValues.indexOf(severity) === -1) severity = "info";
    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={closeErrorDialog}
        >
            <Alert
                elevation={6}
                variant="filled"
                onClose={closeErrorDialog}
                severity={severity}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default Dialog;