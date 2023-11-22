import { useState, useEffect, Fragment } from "react";
import {
  Button,
  Box,
  Grid,
  useTheme,
  Typography,
  Paper,
  Collapse,
} from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import TicketsAPI from "../../../api/tickets/ticketsApi";
import { useParams } from "react-router-dom";
import Chat from "../../../components/Chat";
import StatusBadge from "../../../components/StatusBadge";
import PriorityBadge from "../../../components/PriorityBadge";
import TicketStatusHistory from "../../../components/TicketStatusHistory";
import { useDialog } from "../../../utils/DialogContext";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";

const Ticket = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { showDialog } = useDialog();

  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const handleHistoryExpand = () => {
    setHistoryExpanded(!historyExpanded);
  };

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
        showDialog("Error while fetching ticket", "error");
      }
    };

    fetchTicket();
  }, [ticketId, showDialog]);

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
    "category",
    "customer",
    "expert",
    "product",
    "status",
    "priority",
    "issueDescription",
    "id",
  ];

  return (
    <Box m="20px">
      <Header title="TICKET" subtitle="Single Ticket" />
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
                <Collapse in={!historyExpanded}>
                  <Grid container>
                    {Object.entries(ticket)
                      .sort((a, b) => {
                        return (
                          ticketPropertyOrder.indexOf(a[0]) -
                          ticketPropertyOrder.indexOf(b[0])
                        );
                      })
                      .map(([key, value]) =>
                        key !== "id" ? (
                          <Fragment key={key}>
                            <Grid
                              item
                              xs={key === "issueDescription" ? 9 : 3}
                              mb={key === "issueDescription" ? 1 : 4}
                              style={{
                                display: "flex",
                                alignItems:
                                  key === "issueDescription"
                                    ? "flex-start"
                                    : "center",
                              }}
                            >
                              <Typography
                                variant="h5"
                                sx={ticketPropertyNameStyles}
                              >
                                {key
                                  .replace(/([A-Z]+)/g, " $1")
                                  .replace(/([A-Z][a-z])/g, " $1")}
                              </Typography>
                            </Grid>
                            {key === "issueDescription" ? (
                              <Grid
                                item
                                xs={9}
                                mb={4}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  sx={ticketPropertyValueStyles}
                                  style={{
                                    height: "8vh",
                                    overflowY: "auto",
                                  }}
                                >
                                  {value}
                                </Typography>
                              </Grid>
                            ) : (
                              <Grid
                                item
                                xs={3}
                                mb={4}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {key === "status" ? (
                                  <StatusBadge statusValue={value} />
                                ) : key === "priority" ? (
                                  <PriorityBadge priority={value} />
                                ) : (
                                  <Typography
                                    variant="h5"
                                    sx={ticketPropertyValueStyles}
                                  >
                                    {key === "creationTimestamp"
                                      ? new Date(value)
                                          .toLocaleString()
                                          .replace(",", "")
                                      : key === "expert"
                                      ? value === null
                                        ? "NOT ASSIGNED YET"
                                        : value.name + " " + value.surname
                                      : typeof value === "object"
                                      ? value.hasOwnProperty("surname")
                                        ? value.name + " " + value.surname
                                        : value.name
                                      : value}
                                  </Typography>
                                )}
                              </Grid>
                            )}
                          </Fragment>
                        ) : null
                      )}
                  </Grid>
                </Collapse>
              )}
              <Typography
                variant="h4"
                mb={1}
                sx={{ textTransform: "uppercase", fontWeight: "bold" }}
              >
                Ticket Status History
                <Button onClick={handleHistoryExpand}>
                  {historyExpanded ? (
                    <UnfoldLessIcon
                      fontSize="small"
                      sx={{ color: colors.greenAccent[400] }}
                    />
                  ) : (
                    <UnfoldMoreIcon
                      fontSize="small"
                      sx={{ color: colors.greenAccent[400] }}
                    />
                  )}
                </Button>
              </Typography>
              {ticket && ticketStatus && (
                <TicketStatusHistory
                  history={ticketStatus}
                  expand={historyExpanded}
                />
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
              {ticket && <Chat ticket={ticket} />}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Ticket;
