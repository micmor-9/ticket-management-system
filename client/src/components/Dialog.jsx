import {Alert, Slide, Snackbar} from "@mui/material";
import React from "react";
import { useTheme } from "@emotion/react";
import { tokens } from "../theme";

const Dialog = ({open, closeErrorDialog, message, severity}) => {
    const severityValues = ["success", "info", "warning", "error"];
    if (severityValues.indexOf(severity) === -1) severity = "info";

    function TransitionLeft(props) {
      return <Slide {...props} direction="left" />;
    }

    return (
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={closeErrorDialog}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={TransitionLeft}
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
    );
}

export default Dialog;