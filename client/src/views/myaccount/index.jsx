import React, {useContext, useState} from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Grid,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {tokens} from "../../theme";
import Header from "../../components/Header";
import {AuthContext} from "../../utils/AuthContext";
import authApi from "../../api/auth/authApi";
import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {useDialog} from "../../utils/DialogContext";

const MyAccount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useContext(AuthContext);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const navigate = useNavigate();
    const {showDialog} = useDialog();
    const [, logout] = useContext(AuthContext);

    const handleSavePasswordClick = async () => {
        try {
            console.log(currentUser.email, oldPassword, newPassword);
            authApi.changePassword(currentUser.email, oldPassword, newPassword).then(() => {
                setIsEditingPassword(false);
                setNewPassword("");
                setOldPassword("");
                showDialog("Password changed successfully", "success");
                setTimeout(() => {
                    logout();
                    navigate(`/login`)
                }, 1000);
            });
        } catch (error) {
            showDialog("Error while changing password", "error");
        }
    }

    const Item = styled(Paper)(({theme}) => ({
        backgroundColor:
            theme.palette.mode === "dark"
                ? colors.greenAccent[600]
                : colors.greenAccent[700],
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
    }));

    return (
        <Box m="20px" sx={{position: "relative"}}>
            <Header title="MY ACCOUNT" subtitle="Personal information"/>
            <Paper
                elevation={3}
                sx={{
                    backgroundColor: colors.primary[400],
                    padding: "16px",
                    borderRadius: "8px",
                }}
            >
                <Box sx={{flexGrow: 1}}>
                    <Grid container spacing={2}>
                        <Grid
                            item
                            xs={5}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                        >
                            <Item>
                                <Typography variant="h3">Name: </Typography>
                            </Item>
                            <Typography variant="h3" sx={{marginLeft: "10px"}}>
                                {currentUser.name}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={5}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                        >
                            <Item>
                                <Typography variant="h3">Surname: </Typography>
                            </Item>
                            <Typography variant="h3" sx={{marginLeft: "10px"}}>
                                {currentUser.surname}
                            </Typography>
                        </Grid>
                        {currentUser.role === "Customer" && (
                            <>
                                <Grid
                                    item
                                    xs={5}
                                    display="flex"
                                    flexDirection="row"
                                    alignItems="center"
                                >
                                    <Item>
                                        <Typography variant="h3">Address 1: </Typography>
                                    </Item>
                                    <Typography variant="h3" ml="10px">
                                        {currentUser.address1}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={5}
                                    display="flex"
                                    flexDirection="row"
                                    alignItems="center"
                                >
                                    <Item>
                                        <Typography variant="h3">Address 2: </Typography>
                                    </Item>
                                    <Typography variant="h3" ml="10px">
                                        {currentUser.address2}
                                    </Typography>
                                </Grid>
                            </>
                        )}
                        <Grid
                            item
                            xs={5}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                        >
                            <Item>
                                <Typography variant="h3">Email: </Typography>
                            </Item>
                            <Typography variant="h3" sx={{marginLeft: "10px"}}>
                                {currentUser.email}
                            </Typography>
                        </Grid>

                        {isEditingPassword ? (
                            <Grid
                                item
                                xs={5}
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                            >
                                <TextField
                                    label="Old Password"
                                    type="password"
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <TextField
                                    label="New Password"
                                    type="password"
                                    sx={{ml: "20px", mr: "20px"}}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Button
                                    sx={{
                                        bgcolor: colors.greenAccent[600],
                                        color: colors.primary[100],
                                        padding: theme.spacing(1),
                                    }}
                                    onClick={handleSavePasswordClick}
                                >
                                    SAVE
                                </Button>
                            </Grid>
                        ) : (
                            <Grid
                                item
                                xs={5}
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                            >
                                <Button
                                    sx={{
                                        bgcolor: colors.greenAccent[600],
                                        color: colors.primary[100],
                                        padding: theme.spacing(1),
                                    }}
                                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                                >
                                    <Typography variant="h4">Change Password</Typography>
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Paper>
        </Box>


    );
};

export default MyAccount;
