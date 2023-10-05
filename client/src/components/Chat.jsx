import { useRef, useEffect, useState, useContext } from "react";
import { Client } from "@stomp/stompjs";
import {
  Avatar,
  Box,
  Grid,
  Input,
  IconButton,
  Divider,
  Paper,
  InputBase,
  useTheme,
  Badge,
  Typography,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { tokens } from "../theme";
import MessagesAPI from "../api/messages/messagesApi";
import { AuthContext } from "../utils/AuthContext";
import Lightbox from "./Lightbox";
import ProfilesAPI from "../api/profiles/profilesApi";

const SOCKET_URL = "ws://localhost:8081/ws";

const ChatInputBox = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [fileSelected, setFileSelected] = useState(null);
  const fileInputRef = useRef();

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message, fileSelected);
      setMessage("");
      setFileSelected(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileInputChange = (e) => {
    fileInputRef.current = e.target;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result.split(",")[1];
      const attachment = {
        id: null,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileContent: fileContent,
      };
      setFileSelected(attachment);
    };
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setMessage(file.name);
    };
  };

  const handleDeleteFileSelected = () => {
    setFileSelected(null);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        onKeyDown={handleKeyDown}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!!fileSelected}
      />
      <Input
        type="file"
        id="fileInput"
        sx={{ display: "none" }}
        onInput={handleFileInputChange}
        ref={fileInputRef}
      />
      {fileSelected && (
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="delete-file"
          onClick={handleDeleteFileSelected}
        >
          <DeleteRoundedIcon />
        </IconButton>
      )}
      <label htmlFor="fileInput">
        <IconButton
          component="span"
          sx={{ p: "10px" }}
          aria-label="attach file"
        >
          <Badge color="secondary" badgeContent={1} invisible={!fileSelected}>
            <AttachFileRoundedIcon />
          </Badge>
        </IconButton>
      </label>
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

  const [currentUser] = useContext(AuthContext);
  const chatBoxRef = useRef(null);

  const currentSender = (currentUser?.email).trim();
  const [chatUsers, setChatUsers] = useState(new Map());

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
      {chatMessages.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              opacity: 0.5,
              marginTop: "40%",
            }}
          >
            No messages yet
          </Typography>
        </Box>
      )}
      {chatMessages.map((message) => {
        if (chatUsers.has(message.sender) === false) {
          ProfilesAPI.getUsernameByEmail(message.sender)
            .then((response) => {
              setChatUsers((prevChatUsers) => {
                const newChatUsers = new Map(prevChatUsers);
                newChatUsers.set(message.sender, response);
                return newChatUsers;
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
        return (
          <ChatBubble
            key={message.id}
            message={message}
            currentSender={currentSender}
            chatUsers={chatUsers}
            theme={theme}
            colors={colors}
          />
        );
      })}
      <div ref={chatBoxRef} />
    </Box>
  );
};

const ChatBubble = ({ message, currentSender, chatUsers, theme, colors }) => {
  const [hover, setHover] = useState(false);
  let url = null;
  if (message.attachment) {
    const fileData = atob(message.attachment.fileContent);
    const byteArray = new Uint8Array(fileData.length);
    for (let i = 0; i < fileData.length; i++) {
      byteArray[i] = fileData.charCodeAt(i);
    }

    const blob = new Blob([byteArray], {
      type: message.attachment.fileType,
    });

    url = window.URL.createObjectURL(blob);
  }

  return (
    <Box
      key={message.id}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: `${
          message.sender !== currentSender ? "flex-start" : "flex-end"
        }`,
        mb: "10px",
      }}
    >
      <Box
        sx={{
          p: "10px",
          borderRadius: "10px",
          backgroundColor: `${
            message.sender !== currentSender
              ? theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.primary[400]
              : theme.palette.mode === "dark"
              ? colors.greenAccent[900]
              : colors.greenAccent[300]
          }`,
          color: `${
            message.sender !== currentSender ? "black" : "white"
          } !important`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {message.attachment &&
              (message.attachment.fileType === "image/png" ||
                message.attachment.fileType === "image/jpeg" ||
                message.attachment.fileType === "image/jpg") && (
                <Box>
                  <Lightbox src={url} alt={message.attachment.fileName} />
                </Box>
              )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {message.attachment && (
                <Avatar
                  sx={{
                    mr: 1,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? colors.greenAccent[300]
                        : colors.greenAccent[200],
                    opacity: hover ? 0.8 : 1,
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  {hover ? (
                    <DownloadIcon
                      onClick={() => {
                        if (message.attachment != null) {
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute(
                            "download",
                            message.attachment.fileName
                          );
                          document.body.appendChild(link);
                          link.click();
                          window.URL.revokeObjectURL(url);
                        }
                      }}
                    />
                  ) : (
                    <AttachFileIcon />
                  )}
                </Avatar>
              )}
              {message.messageText}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "5px",
              }}
            >
              <Typography
                style={{
                  color: "#ababab",
                  fontSize: "0.7rem",
                  marginRight: "10px",
                }}
              >
                {chatUsers.get(message.sender)}
              </Typography>
              <Typography
                style={{
                  color: "#ababab",
                  fontSize: "0.7rem",
                }}
              >
                {new Date(message.messageTimestamp).toLocaleString("it-IT", {
                  day: "numeric",
                  month: "numeric",
                  year: "2-digit",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </Typography>
            </Box>
          </Box>
        </div>
      </Box>
    </Box>
  );
};

const Chat = ({ ticket }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useContext(AuthContext);
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);

  const handleSendMessage = (messageText, attachedFile = null) => {
    if (messageText.trim() === "") return;
    const message = {
      id: null,
      messageTimestamp: null,
      messageText: messageText.trim(),
      ticket: ticket.id,
      sender: (currentUser?.email).trim(),
      attachment: attachedFile,
    };

    MessagesAPI.sendMessage(message)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchTicketMessages = async () => {
      if (ticket) {
        try {
          const ticketMessages = await MessagesAPI.getMessagesByTicket(
            ticket.id
          );
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
      clientRef.current = null;
      const client = new Client({
        brokerURL: SOCKET_URL,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        console.log("Connected!");
        subscriptionRef.current = client.subscribe(
          `/topic/${ticket.id}`,
          (message) => {
            const newMessage = JSON.parse(message.body);
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        );
      };

      client.onStompError = function (frame) {
        console.log("Broker reported error: " + frame.headers["message"]);
        console.log("Additional details: " + frame.body);
      };

      client.onWebSocketError = function (frame) {
        console.log("WS reported error: ");
        console.log(frame);
      };

      client.onDisconnect = () => {
        console.log("Disconnected!");
      };

      client.activate();

      clientRef.current = client;

      return () => {
        if (clientRef.current) {
          if (clientRef.current.active) {
            try {
              console.log(clientRef.current);
              if (subscriptionRef.current)
                subscriptionRef.current.unsubscribe();
              clientRef.current.deactivate();
            } catch (error) {
              console.log(error);
            }
          }
        }
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
          {loading ? (
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
