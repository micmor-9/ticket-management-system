import {useState, useEffect} from "react";
import {Box, Grid, useTheme, Typography, Paper} from "@mui/material";
import {tokens} from "../../../theme";
import Header from "../../../components/Header";
import TicketsAPI from "../../../api/tickets/ticketsApi";
import {useParams} from "react-router-dom";
import Chat from "../../../components/Chat";
import "../../../components/statusStyle.css";// Importa il tuo file CSS


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
                const ticketStatusData = await TicketsAPI.getTicketStatusByTicketId(ticketId);
                setTicket(ticketData);
                setTicketStatus(ticketStatusData)
                console.log("ciao", ticketStatusData)
            } catch (error) {
                console.log(error);
            }
        };

        fetchTicket();
    }, [ticketId]);

    return (
        <Box m="20px">
            <Header title="TICKET" subtitle="Single Ticket"/>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                        <Paper
                            sx={{
                                height: "70vh",
                                backgroundColor: colors.primary[400],
                                color:
                                    theme.palette.mode === "dark"
                                        ? colors.primary[100]
                                        : colors.primary[500],
                                padding: "20px",
                                borderRadius: "10px",
                            }}
                        >

                            {ticketStatus && (
                                <table className="status-table">
                                    <thead>
                                    <tr>
                                        <th>Status ID</th>
                                        <th>Status Timestamp</th>
                                        <th>Status</th>
                                        <th>Description</th>
                                        <th>Product Info</th>
                                        <th>Expert Info</th>
                                        {/* Aggiungi altre intestazioni delle colonne, se necessario */}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {ticketStatus.map((status, index) => (
                                        <tr key={index}>
                                            <td>{status.id}</td>
                                            <td>{status.statusTimestamp}</td>
                                            <td>{status.status}</td>
                                            <td>{status.description}</td>
                                            <td>{"Id: " + status.ticket.product.id + " , "}
                                                {"Name: " + status.ticket.product.name}</td>
                                            {status.ticket.expert == null ? (
                                                <td>{"N/A"}</td>) : (
                                                <td>{status.expert.name + "  "}
                                                    {status.expert.surname + " , "}
                                                    {status.expert.email + "  "}</td>
                                            )}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md>
                        <Paper
                            sx={{
                                height: "70vh",
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
                            {/* Includi qui il componente Chat */}
                            {ticket && (
                                <Chat ticket={ticket}/>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Ticket;
