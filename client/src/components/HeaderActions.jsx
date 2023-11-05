import { Box } from "@mui/material";

const HeaderActions = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row-reverse",
        alignContent: "center",
        justifyContent: "flex-start",
        height: "100%",
      }}
    >
      {children}
    </Box>
  );
};

export default HeaderActions;
