import { useState, useEffect } from "react";
import { Box, Grid, useTheme, Typography, Paper } from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import TicketsAPI from "../../../api/tickets/ticketsApi";
import { useParams } from "react-router-dom";
import Chat from "../../../components/Chat";

const Ticket = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketData = await TicketsAPI.getTicketById(ticketId);
        setTicket(ticketData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTicket();
  }, [ticketId]);

  return (
    <Box m="20px">
      <Header title="TICKET" subtitle="Single Ticket" />
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
              <Typography variant="h3">Ticket Data</Typography>
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
              <Chat ticket={ticket} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Ticket;
