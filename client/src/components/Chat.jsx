import { useRef, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  InputBase,
  useTheme,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { tokens } from "../theme";

const ChatInputBox = () => {
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
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="send">
        <SendRoundedIcon />
      </IconButton>
    </Paper>
  );
};

const ChatBubblesBox = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const chatMessages = useMemo(
    () => [
      {
        id: 1,
        text: "Ciao! Ho bisogno di assistenza con il mio prodotto.",
        sender: "customer",
      },
      {
        id: 2,
        text: "Certo, sono qui per aiutarti! Di che cosa hai bisogno?",
        sender: "expert",
      },
      {
        id: 3,
        text: "Ho un problema con la connessione Wi-Fi. Non riesco a connettermi.",
        sender: "customer",
      },
      {
        id: 4,
        text: "Capisco la tua preoccupazione. Proveremo a risolverlo insieme.",
        sender: "expert",
      },
      {
        id: 5,
        text: "Grazie mille! Non so cosa farei senza internet.",
        sender: "customer",
      },
      {
        id: 6,
        text: "Nessun problema, siamo qui per assicurarci che tutto funzioni correttamente.",
        sender: "expert",
      },
      {
        id: 7,
        text: "Sto verificando le impostazioni del router. Potresti provare a riavviare il dispositivo?",
        sender: "expert",
      },
      {
        id: 8,
        text: "Ok, ho riavviato il router ma ancora non si connette.",
        sender: "customer",
      },
      {
        id: 9,
        text: "Hai provato a verificare la password Wi-Fi? Potrebbe essere sbagliata.",
        sender: "expert",
      },
      {
        id: 10,
        text: "Hai ragione, la password era errata. Ora funziona! Grazie mille!",
        sender: "customer",
      },
      {
        id: 11,
        text: "Felice di aver risolto il problema! Se hai altre domande, non esitare a chiedere.",
        sender: "expert",
      },
      {
        id: 12,
        text: "Certamente, ti contatterò se ho bisogno di ulteriore assistenza. Grazie ancora!",
        sender: "customer",
      },
      {
        id: 13,
        text: "Di nulla! Siamo sempre qui per aiutarti. Buona giornata!",
        sender: "expert",
      },
      { id: 14, text: "Grazie, altrettanto! Arrivederci!", sender: "customer" },
      {
        id: 15,
        text: "Arrivederci! Non esitare a tornare se hai bisogno di aiuto.",
        sender: "expert",
      },
      {
        id: 16,
        text: "Ciao! Ci sono altri problemi riguardanti il prodotto?",
        sender: "expert",
      },
      {
        id: 17,
        text: "Al momento no, tutto sembra funzionare correttamente. Grazie!",
        sender: "customer",
      },
      {
        id: 18,
        text: "Perfetto! Se hai bisogno in futuro, non esitare a contattarci. Buona giornata!",
        sender: "expert",
      },
    ],
    []
  );

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
              {message.text}
            </Box>
          </Box>
        );
      })}
      <div ref={chatBoxRef} />
    </Box>
  );
};

const Chat = ({ ticket }) => {
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
          <ChatBubblesBox />
        </Grid>
      </Grid>
      <ChatInputBox />
    </Box>
  );
};

export default Chat;
