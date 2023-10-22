import { Typography, Box, useTheme, Breadcrumbs, Link } from "@mui/material";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const location = window.location.pathname.split("/").filter((x) => x !== "");

  return (
    <Box mb="30px">
      {location.length > 1 && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: "5px" }}>
          {location.map((path, index) => {
            return (
              <Link
                key={index}
                underline="hover"
                color="inherit"
                onClick={() => {
                  navigate("/" + location.slice(0, index + 1).join("/"));
                }}
                sx={{ cursor: "pointer" }}
              >
                {path}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight={"bold"}
        sx={{ mb: "5px", position: "relative" }}
      >
        {location.length > 1 && (
          <ArrowBackIosNewIcon
            sx={{
              color: colors.grey[100],
              cursor: "pointer",
              position: "absolute",
              top: "35%",
              left: "-15px",
              fontSize: "small",
            }}
            onClick={() => {
              navigate(-1);
            }}
          />
        )}
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
