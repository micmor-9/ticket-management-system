import {
    Box,
} from "@mui/material";
import React from "react";
import Header from "../../components/Header";
import CreateTicketForm from "../../components/forms/CreateTicketForm";


const CreateTicket = () => {
    return (
        <Box m="20px">
            <Header title="NEW TICKET" subtitle="Open a new Ticket"/>
            <CreateTicketForm/>
        </Box>
    );
};

export default CreateTicket;
