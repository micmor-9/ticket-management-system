import { useState, useEffect, Fragment, useContext } from "react";
import {
  Button,
  Box,
  Grid,
  useTheme,
  Typography,
  Paper,
  Collapse,
  Divider,
  Backdrop,
  Rating,
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
import StarIcon from "@mui/icons-material/Star";
import { AuthContext } from "../../../utils/AuthContext";

const Ticket = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { showDialog } = useDialog();

  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [currentUser] = useContext(AuthContext);

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
    "order",
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
                        key !== "id" && key !== "rating" ? (
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
                                {key === "order" ? (
                                  <Typography
                                    variant="h5"
                                    sx={ticketPropertyValueStyles}
                                  >
                                    {value && value.id ? value.id : "N/A"}
                                  </Typography>
                                ) : null}
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
              <Divider />
              {ticket && ticketStatus && (
                <TicketStatusHistory
                  history={ticketStatus}
                  expand={historyExpanded}
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md>
            <Box sx={{ position: "relative", zIndex: 0 }}>
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
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Typography variant="h3">Messages</Typography>
                {ticket && <Chat ticket={ticket} />}
              </Paper>
              {ticket && ticket.status === "RESOLVED" && (
                <SupportEvaluation colors={colors} ticket={ticket} />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const SupportEvaluation = (props) => {
  const { showDialog } = useDialog();
  const [currentUser] = useContext(AuthContext);
  const [rated, setRated] = useState(false)

  const labels = {
    1: "Very Bad",
    2: "Bad",
    3: "Okay",
    4: "Good",
    5: "Excellent",
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  const [value, setValue] = useState(
    props.ticket.rating ? props.ticket.rating : 4
  );
  const [hover, setHover] = useState(-1);

  const handleRatingChange = (newValue) => {
    try {
      TicketsAPI.updateTicketRating(props.ticket.id, newValue);
      showDialog("Rating correctly updated!", "success");
    } catch (error) {
      console.log("Error");
    }
    setValue(newValue);
    setRated(!rated);
  };

  return (
    <Backdrop
      sx={{
        position: "absolute",
        top: 0,
        zIndex: 1,
        color: "#fff",
        backdropFilter: "blur(0.5px)",
        borderRadius: "10px",
      }}
      open={true}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",

          height: "100%",
        }}
      >
        <Paper
          sx={{
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: props.colors.greenAccent[700],
            textAlign: "center",
            width: "400px",
          }}
        >
          <Typography variant="h2" fontWeight="bold" sx={{ color: "#FFA300" }}>
            Ticket Resolved!
          </Typography>

          {currentUser.role === "Client" && !rated && !props.ticket.rating ? (
            <Box>
              <Box my={2}>
                <Typography variant="h4">
                  We would be very grateful if you could leave a review.
                </Typography>
              </Box>
              <Box
                my={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Rating
                  precision={1}
                  value={value}
                  getLabelText={getLabelText}
                  onChange={(event, newValue) => {
                    handleRatingChange(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                  size="large"
                />
                {value !== null && (
                  <Typography fontSize="30px" sx={{ ml: 2 }}>
                    {labels[hover !== -1 ? hover : value]}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="h4" mt={3}>
                Review to customer service
              </Typography>
              {(currentUser.role !== 'Client' && !props.ticket.rating) ? (
                <Typography variant="h3" fontWeight="bold" mt={2} mb={2}>
                  {" "}
                  Not present yet
                </Typography>
              ) : (
                <Typography variant="h3" fontWeight="bold" mt={2} mb={2}>
                  {" "}
                  {labels[value]}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Backdrop>
  );
};

export default Ticket;

// {
//   !props.ticket.rating ? (
//     <Box>
//       <Box my={2}>
//         <Typography variant="h4">
//           We would be very grateful if you could leave a review.
//         </Typography>
//       </Box>
//       <Box
//         my={2}
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//         }}
//       >
//         <Rating
//           precision={1}
//           value={value}
//           getLabelText={getLabelText}
//           onChange={(event, newValue) => {
//             setValue(newValue);
//             handleRatingChange(newValue);
//           }}
//           onChangeActive={(event, newHover) => {
//             setHover(newHover);
//           }}
//           emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
//           size="large"
//         />
//         {value !== null && (
//           <Typography fontSize="30px" sx={{ ml: 2 }}>
//             {labels[hover !== -1 ? hover : value]}
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   ) : (
//     <Box>
//       <Typography variant="h4" mt={3}>
//         Your review to customer service:
//       </Typography>
//       <Typography variant="h3" fontWeight="bold" mt={2} mb={2}>
//         {" "}
//         {labels[value]}
//       </Typography>
//     </Box>
//   );
// }
