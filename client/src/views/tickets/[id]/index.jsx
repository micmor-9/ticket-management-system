import {useState, useEffect} from "react";
import {Box, Grid, useTheme, Typography, Paper, Step, Stepper, StepLabel, StepContent} from "@mui/material";
import {tokens} from "../../../theme";
import Header from "../../../components/Header";
import TicketsAPI from "../../../api/tickets/ticketsApi";
import {useParams} from "react-router-dom";
import Chat from "../../../components/Chat";
import StatusBadge from "../../../components/StatusBadge";
import PriorityBadge from "../../../components/PriorityBadge";
import Button from "@mui/material/Button";
import TicketStatusHistory from "../../../components/TicketStatusHistory";

const Ticket = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const {ticketId} = useParams();
    const [ticket, setTicket] = useState(null);
    const [ticketStatus, setTicketStatus] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const ticketData = await TicketsAPI.getTicketById(ticketId);
                const ticketStatusData = await TicketsAPI.getTicketStatusByTicketId(
                    ticketId
                );
                setTicket(ticketData);
                setTicketStatus(ticketStatusData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchTicket();
    }, [ticketId]);

    const ticketPropertyNameStyles = {
        fontWeight: "bold",
        color: colors.primary[200],
        textTransform: "uppercase",
    };

    const ticketPropertyValueStyles = {
        color: colors.primary[100],
    };

    const ticketPropertyOrder = [
        "creationTimestamp",
        "customer",
        "expert",
        "product",
        "status",
        "priority",
        "issueDescription",
        "id"
    ]
    console.log(ticket);
    console.log(ticketStatus);

    return (
        <Box m="20px">
            <Header title="TICKET" subtitle="Single Ticket"/>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                        <Paper
                            sx={{
                                height: "75vh",
                                backgroundColor: colors.primary[400],
                                color:
                                    theme.palette.mode === "dark"
                                        ? colors.primary[100]
                                        : colors.primary[500],
                                padding: "20px",
                                borderRadius: "10px",
                            }}
                        >
                            {ticket && typeof ticket === "object" && (
                                <Grid container>
                                    {Object.entries(ticket).sort((a, b) => {
                                        return ticketPropertyOrder.indexOf(a[0]) - ticketPropertyOrder.indexOf(b[0]);
                                    }).map(([key, value]) => (
                                        key !== "id" ? (
                                            <>
                                                <Grid item xs={3} mb={4}
                                                      style={{
                                                          display: "flex",
                                                          alignItems: key === "issueDescription" ? "flex-start" : "center"
                                                      }}>
                                                    <Typography
                                                        variant="h5"
                                                        sx={ticketPropertyNameStyles}
                                                    >
                                                        {key.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")}
                                                    </Typography>
                                                </Grid>
                                                {key === "issueDescription" ? (
                                                    <Grid item xs={9} mb={4}
                                                          style={{display: "flex", alignItems: "center"}}>
                                                        <Typography
                                                            variant="h5"
                                                            sx={ticketPropertyValueStyles}
                                                            style={{
                                                                height: "10vh",
                                                                overflowY: "auto",
                                                            }}
                                                        >
                                                            {value}
                                                        </Typography>
                                                    </Grid>
                                                ) : (
                                                    <Grid item xs={3} mb={4}
                                                          style={{display: "flex", alignItems: "center"}}>
                                                        {key === "status" ? (
                                                            <StatusBadge statusValue={value}/>
                                                        ) : key === "priority" ? (
                                                            <PriorityBadge priority={value}/>
                                                        ) : (
                                                            <Typography
                                                                variant="h5"
                                                                sx={ticketPropertyValueStyles}
                                                            >
                                                                {key === "creationTimestamp" ? (
                                                                    new Date(value).toLocaleString().replace(",", "")
                                                                ) : key === "expert" ? (
                                                                    value === null ? "NOT ASSIGNED YET" : value.name + " " + value.surname
                                                                ) : (
                                                                    typeof value === "object" ? value.hasOwnProperty("surname") ? value.name + " " + value.surname : value.name : value
                                                                )}
                                                            </Typography>
                                                        )}
                                                    </Grid>)}
                                            </>) : null
                                    ))}
                                </Grid>
                            )}
                            <Typography variant="h4" sx={{textTransform: "uppercase", fontWeight: "bold"}}>Ticket Status
                                History</Typography>
                            {ticket && ticketStatus && (
                                <TicketStatusHistory history={ticketStatus}/>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md>
                        <Paper
                            sx={{
                                height: "75vh",
                                backgroundColor: colors.greenAccent[800],
                                color:
                                    theme.palette.mode === "dark"
                                        ? colors.primary[100]
                                        : colors.primary[500],
                                padding: "20px",
                                borderRadius: "10px",
                            }}
                        >
                            <Typography variant="h3">Messages</Typography>
                            {ticket && <Chat ticket={ticket}/>}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Ticket;
