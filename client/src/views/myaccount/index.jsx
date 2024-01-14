import React, { useContext, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    TextField,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {tokens} from "../../theme";
import Header from "../../components/Header";
import { AuthContext, useAuth } from "../../utils/AuthContext";
import authApi from "../../api/auth/authApi";
import {useNavigate} from "react-router-dom";

const MyAccount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useContext(AuthContext);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const navigate = useNavigate();

    const handleEditPasswordClick = () => {
        setIsEditingPassword(true);
    };

    const handleSavePasswordClick = async () => {
        try {
            await authApi.changePassword(currentUser.email, oldPassword, newPassword);
            setIsEditingPassword(false);
            setOldPassword("");
            setNewPassword("");
            navigate("/login");
        } catch (error) {
            console.error("Error while changing password:", error);
        }
    };
    return (
        <Box m="20px" sx={{ position: "relative" }}>
            <Header title="MY ACCOUNT" subtitle="Personal information" />
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
                        </ListItem>
                    )}
                    {currentUser.role === "Client" && (
                        <ListItem>
                            <ListItemText
                                primary="Address"
                                secondary={currentUser.address || "N/A"}
                            />
                        </ListItem>
                    )}
                    <ListItem>
                        {isEditingPassword ? (
                            <>
                                <TextField
                                    label="Old Password"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <TextField
                                    label="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </>
                        ) : (
                            <Button onClick={handleEditPasswordClick}>Edit Password</Button>
                        )}
                    </ListItem>

                    {isEditingPassword && (
                        <ListItem>
                            <Button onClick={handleSavePasswordClick}>Save Password</Button>
                        </ListItem>
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default MyAccount;
