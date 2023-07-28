import { useRef, useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import {
  Box,
  Grid,
  IconButton,
  Divider,
  Paper,
  InputBase,
  useTheme,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import { tokens } from "../theme";
import { getMessagesByTicket } from "../api/messages/messagesApi";
import { AuthContext } from "../utils/AuthContext";

const ChatInputBox = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        position: "sticky",
        bottom: "0",
        zIndex: 1,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Type your message"
        inputProps={{ "aria-label": "type your message" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <AttachFileRoundedIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="send"
        onClick={handleSendMessage}
      >
        <SendRoundedIcon />
      </IconButton>
    </Paper>
  );
};

const ChatBubblesBox = ({ chatMessages }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages]);

  return (
    <Box
      sx={{
        maxHeight: "55vh",
        width: "100%",
        overflowY: "auto",
        marginBottom: "50px",
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
      {chatMessages.map((message) => {
        return (
          <Box
            key={message.id}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: `${
                message.sender === "expert" ? "flex-start" : "flex-end"
              }`,
              mb: "10px",
            }}
          >
            <Box
              sx={{
                p: "10px",
                borderRadius: "10px",
                backgroundColor: `${
                  message.sender === "expert"
                    ? theme.palette.mode === "dark"
                      ? colors.grey[100]
                      : colors.primary[400]
                    : theme.palette.mode === "dark"
                    ? colors.greenAccent[900]
                    : colors.greenAccent[300]
                }`,
                color: `${
                  message.sender === "expert" ? "black" : "white"
                } !important`,
              }}
            >
              {message.messageText}
            </Box>
          </Box>
        );
      })}
      <div ref={chatBoxRef} />
    </Box>
  );
};

const Chat = ({ ticket }) => {
  const socketRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useContext(AuthContext);

  const handleSendMessage = (messageText) => {
    // Invia il messaggio tramite WebSocket al server
    socketRef.current.emit("/app/chat.sendMessage", {
      id: null,
      messageTimestamp: null,
      messageText: messageText,
      ticket: ticket.id,
      sender: currentUser.name,
    });
  };

  useEffect(() => {
    const fetchTicketMessages = async () => {
      if (ticket) {
        try {
          const ticketMessages = await getMessagesByTicket(ticket.id);
          setChatMessages(ticketMessages);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      }
    };

    fetchTicketMessages();
  }, [ticket]);

  useEffect(() => {
    if (ticket) {
      // Connessione al server WebSocket
      socketRef.current = io("http://localhost:8081/ws", {
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Gestisci la ricezione di nuovi messaggi dal server
      socketRef.current.on(`/topic/${ticket.id}`, (newMessage) => {
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      // Pulizia delle connessioni WebSocket quando il componente viene smontato
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [ticket]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "95%",
        width: "100%",
        overflow: "hidden",
        padding: "10px 0",
      }}
    >
      <Grid container direction="column" sx={{ height: "100%" }}>
        <Grid item sx={{ flex: 1 }}>
          {loading ? ( // Mostra un indicatore di caricamento se loading è true
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <ChatBubblesBox chatMessages={chatMessages} />
          )}
        </Grid>
      </Grid>
      <ChatInputBox onSendMessage={handleSendMessage} />
    </Box>
  );
};

export default Chat;
