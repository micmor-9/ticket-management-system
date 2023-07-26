import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";

const Ticket = () => {
  return (
    <Box m="20px">
      <Header title="TICKET" subtitle="Single Ticket" />
    </Box>
  );
};

export default Ticket;
