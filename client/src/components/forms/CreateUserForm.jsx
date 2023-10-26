import {Box, Button, TextField, useTheme} from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import profilesApi from "../../api/profiles/profilesApi";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {tokens} from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

const CreateUserForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const theme = useTheme();
    const [errors, setErrors] = useState({});
    const colors = tokens(theme.palette.mode);
    /*const initialProfile = {
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address1: "",
        address2: "",
    };*/

    const [profile, setProfile] = useState({});
    const handleFormSubmit = (values) => {

        const profile = {
            id: 0,
            email: values.email,
            name: values.firstName,
            surname: values.lastName,
        };
        console.log('Dati inviati al server:', profile);

        /* profilesApi.createUser(profile)
             .then((response) => {
                 console.log(response);
             })
             .catch((error) => {
                 console.log(error);
             });*/

    };

    const handleFieldChange = (fieldName, value) => {
        setProfile({ ...profile, [fieldName]: value });
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
                            value={profile? profile.firstName: ""}
                            sx={{gridColumn: "span 2"}}
                        />
                        <TextField
                            fullWidth
                            type="text"
                            label="Last Name"
                            value={profile? profile.lastName : ""}
                            name="lastName"
                            sx={{gridColumn: "span 2"}}
                        />
                        <TextField
                            fullWidth
                            type="text"
                            label="Email"
                            value={profile? profile.email: ""}
                            name="email"
                            sx={{gridColumn: "span 4"}}
                        />
                        <TextField
                            fullWidth
                            type="text"
                            label="Contact Number"
                            value={profile ? profile.contact: ""}
                            name="contact"
                            sx={{gridColumn: "span 4"}}
                        />
                        <TextField
                            fullWidth
                            type="text"
                            label="Address 1"
                            value={profile ? profile.address1 : ""}
                            name="address1"
                            sx={{gridColumn: "span 4"}}
                        />
                        <TextField
                            fullWidth
                            type="text"
                            label="Address 2"
                            value={profile ? profile.address2 : ""}
                            name="address2"
                            sx={{gridColumn: "span 4"}}
                        />

                    <Box display="flex" justifyContent="flex-end" gridColumn="span 4">
                        <Button type="button"  variant="contained" startIcon={<DeleteIcon />}
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
                        <Button type="submit" startIcon={<SendIcon />} variant="contained"
                                sx={{
                                    backgroundColor: colors.greenAccent[600],
                                    marginRight: "0px",
                                    "&:hover": {
                                        backgroundColor: colors.greenAccent[400],
                                    },
                                }}>
                            Create New User
                        </Button>
                    </Box>
                    </Box>
    );
};

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    contact: yup
        .string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("required"),
    address1: yup.string().required("required"),
    address2: yup.string().required("required"),
});
const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address1: "",
    address2: "",
};

export default CreateUserForm;
