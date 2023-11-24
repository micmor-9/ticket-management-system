import {Box, Typography, useTheme} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import LoopIcon from "@mui/icons-material/Loop";
import BuildIcon from "@mui/icons-material/Build";
import RemoveIcon from "@mui/icons-material/Remove";
import {tokens} from "../theme";
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from "@mui/lab";

const TicketStatusHistory = ({history, expand}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const iconStyles = () => {
        return {
            fontSize: "x-large",
        };
    };

    const icons = {
        OPEN: <AddIcon sx={iconStyles("OPEN")}/>,
        IN_PROGRESS: <BuildIcon sx={iconStyles("IN_PROGRESS")}/>,
        CLOSED: <RemoveIcon sx={iconStyles("CLOSED")}/>,
        RESOLVED: <CheckIcon sx={iconStyles("RESOLVED")}/>,
        REOPENED: <LoopIcon sx={iconStyles("REOPENED")}/>,
    };


    const getStatusChangeDescription = (currentStatus, previousStatus, currentExpert, previousExpert) => {
        if (!previousStatus && !previousExpert) {
            return `Ticket Opened`
        }

        let changeDescription = '';

        if (currentStatus !== previousStatus) {
            switch (currentStatus) {
                case 'IN_PROGRESS':
                    changeDescription = 'Ticket Is Now In Progress';
                    break;
                case 'CLOSED':
                    changeDescription = 'Ticket Has Been Closed';
                    break;
                case 'RESOLVED':
                    changeDescription = 'Ticket Has Been Resolved';
                    break;
                case 'REOPENED':
                    changeDescription = 'Ticket Has Been Reopened';
                    break;
                // Aggiungi altri casi secondo necessità
                default:
                    changeDescription = `Stato non gestito: ${currentStatus}`;
            }
        }



        if (currentExpert  !== previousExpert) {
            if (changeDescription) {
                // Aggiungi una nuova riga solo se c'è già qualcosa in changeDescription
                changeDescription += ' and ';
            }
            changeDescription += 'Expert Assigned To your Ticket is changed.'

        }

        return changeDescription
    };

return (
    <Box
      sx={{
        overflowY: "auto",
        height: expand ? "66vh" : "28vh",
        transition: expand ? "height 0.2s ease-in-out" : "height 0.2s ease-out",
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
        "&::-webkit-scrollbar-thumb:active": {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      {history && history.length > 0 ? (
        <Timeline
          sx={{
            marginTop: 0,
            maxHeight: "300vh",
            position: "relative",
            alignItems: "center",
          }}
        >
          {history.map((status, idx) => (
            <TimelineItem>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography
                variant={"h4"}
                sx={{
                  fontWeight: "bold",
                  color: colors.greenAccent[400],
                  textAlign: "end",
                }}
              >
                {status.status.replace("_", " ")}
              </Typography>
              <Typography variant={"h5"} sx={{ textAlign: "end" }}>
                {status.description}
              </Typography>
              {status.expert && (
                <Typography
                  variant={"subtitle1"}
                  sx={{ color: colors.greenAccent[500], textAlign: "end" }}
                >
                  {status.expert.name + " " + status.expert.surname}
                </Typography>
              )}
              <Typography
                variant={"subtitle2"}
                sx={{ color: colors.primary[200], textAlign: "end" }}
              >
                {new Date(status.statusTimestamp)
                  .toLocaleString()
                  .replace(",", "")}
              </Typography>
              </TimelineContent>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    backgroundColor: colors.status[status.status],
                    color: colors.primary[400],
                  }}
                >
                  {icons[String(status.status)]}
                </TimelineDot>
                {idx !== history.length - 1 ? <TimelineConnector /> : null}
              </TimelineSeparator>
              <TimelineOppositeContent
                sx={{ py: "12px", px: 2, textAlign: "start" }}
              >
                  <Typography variant="h5" component="span">
                      {console.log(history[idx].expert)}
                      {getStatusChangeDescription(

                          history[idx].status,
                          idx > 0 ? history[idx - 1].status : null,
                          idx > 0 ? history[idx].expert.id : null,
                          idx > 1 ? history[idx - 1].expert.id : null,
                      )}
                  </Typography>
              </TimelineOppositeContent>
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <Typography variant={"h4"}>No status history</Typography>
      )}
    </Box>
  );
};

export default TicketStatusHistory;
