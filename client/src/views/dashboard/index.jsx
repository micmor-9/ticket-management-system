import { Box, Grid, Typography, Paper } from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Paper
              sx={{
                backgroundColor: colors.primary[400],
                color:
                  theme.palette.mode === "dark"
                    ? colors.primary[100]
                    : colors.primary[500],
                padding: "20px",
                borderRadius: "10px",
                height: "35vh",
              }}
            >
              <Typography variant="h3">1st Square</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              sx={{
                backgroundColor: colors.greenAccent[800],
                color:
                  theme.palette.mode === "dark"
                    ? colors.primary[100]
                    : colors.primary[500],
                padding: "20px",
                borderRadius: "10px",
                height: "35vh",
              }}
            >
              <Typography variant="h3">2nd Square</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              sx={{
                backgroundColor: colors.blueAccent[600],
                color:
                  theme.palette.mode === "dark"
                    ? colors.primary[100]
                    : colors.primary[500],
                padding: "20px",
                borderRadius: "10px",
                height: "35vh",
              }}
            >
              <Typography variant="h3">3rd Square</Typography>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper
              sx={{
                backgroundColor: colors.redAccent[800],
                color:
                  theme.palette.mode === "dark"
                    ? colors.primary[100]
                    : colors.primary[500],
                padding: "20px",
                borderRadius: "10px",
                height: "35vh",
              }}
            >
              <Typography variant="h3">4th Square</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
