import {Box, Button, TextField, useTheme} from "@mui/material";
import profilesApi from "../../api/profiles/profilesApi";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {tokens} from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

const CreateUserForm = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address1: "",
        address2: "",
    });
    const colors = tokens(theme.palette.mode);

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address1: "",
        address2: "",
    });
    const handleFormSubmit = () => {
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
        validateLength("address1", profile.address1, "Address", 5, 100);
        if (profile.address2.length > 0) {
            validateLength("address2", profile.address2, "Address2", 5, 100);
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const profileData = {
                id: 0,
                email: profile.email,
                name: profile.firstName,
                surname: profile.lastName,
                contact: profile.contact,
                address1: profile.address1,
                address2: profile.address2,
            };

            profilesApi.createUser(profileData)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });

            navigate(-1);
        }
    };
    const handleFieldChange = (fieldName, value) => {
        setProfile({...profile, [fieldName]: value});
    };
    const disabledTextFieldStyle = {
        "& .Mui-disabled": {
            color:
                theme.palette.mode === "dark"
                    ? colors.greenAccent[600] + " !important"
                    : colors.greenAccent[200] + " !important",
        },
        "& .MuiInputBase-input": {
            color:
                theme.palette.mode === "dark"
                    ? colors.greenAccent[300]
                    : colors.greenAccent[200],
        },
        gridColumn: "span 4",
    };

    return (
        <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
                backgroundColor: colors.primary[400],
                color:
                    theme.palette.mode === "dark"
                        ? colors.primary[100]
                        : colors.primary[500],
                borderRadius: "10px",
                padding: "20px",
            }}
            component="form"
        >
            <TextField
                fullWidth
                type="text"
                label="First Name"
                value={profile.firstName}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
                required
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Last Name"
                value={profile.lastName}
                name="lastName"
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
                required
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Email"
                value={profile ? profile.email : ""}
                name="email"
                sx={disabledTextFieldStyle}
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
                onChange={(e) => handleFieldChange("email", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Contact Number"
                value={profile ? profile.contact : ""}
                name="contact"
                sx={disabledTextFieldStyle}
                error={Boolean(errors.contact)}
                helperText={errors.contact}
                required
                onChange={(e) => handleFieldChange("contact", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Address 1"
                value={profile ? profile.address1 : ""}
                name="address1"
                sx={disabledTextFieldStyle}
                error={Boolean(errors.address1)}
                helperText={errors.address1}
                required
                onChange={(e) => handleFieldChange("address1", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Address 2"
                value={profile ? profile.address2 : ""}
                name="address2"
                sx={disabledTextFieldStyle}
                error={Boolean(errors.address2)}
                helperText={errors.address2}
                onChange={(e) => handleFieldChange("address2", e.target.value)}
            />

            <Box display="flex" justifyContent="flex-end" gridColumn="span 4">
                <Button type="button" variant="contained" startIcon={<DeleteIcon/>}
                        sx={{
                            backgroundColor: colors.redAccent[600],
                            margin: "0 20px 0 0",
                            "&:hover": {
                                backgroundColor: colors.redAccent[500],
                            },
                        }}
                        onClick={() => {
                            navigate(-1);
                        }}>
                    Cancel
                </Button>
                <Button type="button" startIcon={<SendIcon/>} variant="contained"
                        sx={{
                            backgroundColor: colors.greenAccent[600],
                            marginRight: "0px",
                            "&:hover": {
                                backgroundColor: colors.greenAccent[400],
                            },
                        }}
                        onClick={handleFormSubmit}
                >
                    Create New User
                </Button>
            </Box>
        </Box>
    );
};

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
/*
const checkoutSchema = yup.object().shape({
    firstName: yup.string()
        .min(2, "First name is too short")
        .max(50, "First name is too long"),
    lastName: yup.string()
        .min(2, "Last name is too short")
        .max(50, "Last name is too long"),
    email: yup.string()
        .email("Invalid email format")
        .min(2, "Email is too short")
        .max(50, "Email is too long"),
    contact: yup.string()
        .matches(phoneRegExp, "Phone number is not valid"),
    address1: yup.string()
        .min(5, "Address 1 is too short")
        .max(100, "Address 1 is too long"),
    address2: yup.string()
        .min(5, "Address 2 is too short")
        .max(100, "Address 2 is too long"),
});*/

export default CreateUserForm;
