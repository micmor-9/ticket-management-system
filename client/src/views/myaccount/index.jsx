import React, {useContext} from "react";
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {AuthContext, useAuth} from "../../utils/AuthContext";

const MyAccount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useContext(AuthContext);

    return (
        <Box m="20px" sx={{position: "relative"}}>
            <Header title="MY ACCOUNT" subtitle="Personal informations"/>
            <Paper
                elevation={3}
                sx={{
                    backgroundColor: colors.primary[400],
                    padding: "16px",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    My Account
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Name"
                            secondary={currentUser.name || "N/A"}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Surname"
                            secondary={currentUser.surname || "N/A"}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Email"
                            secondary={currentUser.email || "N/A"}
                        />
                    </ListItem>
                    {currentUser.role === "Client" && (
                    <ListItem>
                        <ListItemText
                            primary="Contact"
                            secondary={currentUser.contact || "N/A"}
                        />
                    </ListItem> )}
                    {currentUser.role === "Client" && (
                    <ListItem>
                        <ListItemText
                            primary="Address"
                            secondary={currentUser.address || "N/A"}
                        />
                    </ListItem> )}
                </List>
            </Paper>
        </Box>
    );
};

export default MyAccount;
