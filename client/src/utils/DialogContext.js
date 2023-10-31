import {createContext, useContext, useState} from "react";
import Dialog from "../components/Dialog";

const DialogContext = createContext();

export const useDialog = () => {
    return useContext(DialogContext);
}
export const DialogProvider = ({children}) => {
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("info");
    const [open, setOpen] = useState(false);

    const showDialog = (message, severity) => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <DialogContext.Provider value={
            {
                message,
                severity,
                open,
                showDialog,
                closeDialog,
            }
        }>
            {children}
            <Dialog
                open={open}
                closeErrorDialog={closeDialog}
                message={message}
                severity={severity}
            />
        </DialogContext.Provider>
    );
};