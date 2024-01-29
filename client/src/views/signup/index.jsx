import React, {useState} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import * as authApi from "../../api/auth/authApi";
import PersonIcon from "@mui/icons-material/Person";
import {useDialog} from "../../utils/DialogContext";


const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const Signup = () => {
    const {showDialog} = useDialog();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address1: "",
        address2: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address1: "",
        address2: "",
        password: "",
    });

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};
        const validateLength = (field, value, name, min, max) => {
            if (value.length === 0) {
                newErrors[field] = "Required";
            } else if (value.length < min) {
                newErrors[field] = `${name} is too short`;
            } else if (value.length > max) {
                newErrors[field] = `${name} is too long`;
            }
        };

        validateLength("firstName", profile.firstName, "First Name", 2, 50);
        validateLength("lastName", profile.lastName, "Last Name", 2, 50);

        if (profile.email.length === 0) {
            newErrors.email = "Required";
        } else if (!emailRegExp.test(profile.email)) {
            newErrors.email = "Invalid email format";
        } else {
            validateLength("email", profile.email, "Email", 2, 50);
        }

        if (profile.contact.length === 0) {
            newErrors.contact = "Required";
        } else if (!phoneRegExp.test(profile.contact)) {
            newErrors.contact = "Invalid contact number format";
        } else {
            validateLength("contact", profile.contact, "Contact number", 2, 50);
        }
        validateLength("address1", profile.address1, "Address", 2, 100);
        if (profile.address2.length > 0) {
            validateLength("address2", profile.address2, "Address2", 2, 100);
        }

        if (profile.password.length === 0) {
            newErrors.password = "Required";
        } else {
            validateLength("password", profile.password, "Password", 5, 20);
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const profileData = {
                email: profile.email,
                name: profile.firstName,
                surname: profile.lastName,
                contact: profile.contact,
                address1: profile.address1,
                password: profile.password,
                address2: profile.address2 ? profile.address2 : null,
            };

            try {
                await authApi.signup(profileData);
                showDialog("Signup completed successfully!", "success");
                setTimeout(() => {
                    navigate("/login")
                }, 1000);
            } catch (error) {
                showDialog("An error occurred while signing up", "error");
            }
        }
    };

    const handleFieldChange = (fieldName, value) => {
        setProfile({...profile, [fieldName]: value});
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
                    <PersonIcon sx={{fontSize: 40}}/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleFormSubmit} method={"post"} noValidate sx={{mt: 1}}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                fullWidth
                                type="text"
                                label="First Name"
                                value={profile.firstName}
                                sx={{gridColumn: "span 2"}}
                                error={Boolean(errors.firstName)}
                                helperText={errors.firstName}
                                required
                                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                fullWidth
                                type="text"
                                label="Last Name"
                                value={profile.lastName}
                                name="lastName"
                                sx={{gridColumn: "span 2"}}
                                error={Boolean(errors.lastName)}
                                helperText={errors.lastName}
                                required
                                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                fullWidth
                                type="text"
                                label="Email"
                                value={profile ? profile.email : ""}
                                name="email"
                                sx={{gridColumn: "span 2"}}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                required
                                onChange={(e) => handleFieldChange("email", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                fullWidth
                                type="text"
                                label="Contact Number"
                                value={profile ? profile.contact : ""}
                                name="contact"
                                sx={{gridColumn: "span 2"}}
                                error={Boolean(errors.contact)}
                                helperText={errors.contact}
                                required
                                onChange={(e) => handleFieldChange("contact", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                fullWidth
                                type="text"
                                label="Address 1"
                                value={profile ? profile.address1 : ""}
                                name="address1"
                                sx={{gridColumn: "span 2"}}
                                error={Boolean(errors.address1)}
                                helperText={errors.address1}
                                required
                                onChange={(e) => handleFieldChange("address1", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                fullWidth
                                type="text"
                                label="Address 2"
                                value={profile ? profile.address2 : ""}
                                name="address2"
                                sx={{gridColumn: "span 2"}}
                                error={Boolean(errors.address2)}
                                helperText={errors.address2}
                                onChange={(e) => handleFieldChange("address2", e.target.value)}
                            />

                        </Grid>
                        <TextField
                            margin="normal"
                            fullWidth
                            type="password"
                            label="Password"
                            value={profile ? profile.password : ""}
                            name="password"

                            sx={{gridColumn: "span 2", width: "99  %", marginLeft: "15px"}}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            onChange={(e) => handleFieldChange("password", e.target.value)}
                        />
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Register
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            navigate("/login");
                        }}
                        fullWidth
                        variant="outlined"
                        sx={{mt: 1, mb: 2}}
                    >
                        Back to Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Signup;

