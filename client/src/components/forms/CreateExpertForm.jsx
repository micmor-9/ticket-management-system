import {Box, Button, TextField, useTheme} from "@mui/material";
import profilesApi from "../../api/profiles/profilesApi";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {tokens} from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import authApi from "../../api/auth/authApi";
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import TicketsAPI from "../../api/tickets/ticketsApi";
import {useDialog} from "../../utils/DialogContext";

const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const CreateExpertForm = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [ticketAreas, setTicketAreas] = useState([]);
    const {showDialog} = useDialog();
    const filter = createFilterOptions();

    const [profile, setProfile] = useState({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        specialization: "",
    });

    const [specialization, setSpecialization] = useState(profile ? {
        inputValue: profile.specialization,
        title: profile.specialization
    } : "");
    const colors = tokens(theme.palette.mode);

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        specialization: "",
    });

    useEffect(() => {
        const fetchTicketAreas = async () => {
            try {
                const ticketAreasData = await TicketsAPI.getTicketAreas();
                setTicketAreas(ticketAreasData);
            } catch (error) {
                showDialog("Error while fetching ticket areas", "error");
            }
        }
        fetchTicketAreas();
    }, []);

    const handleFormSubmit = async () => {
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

        validateLength("id", profile.id, "Id", 1, 50);
        validateLength("firstName", profile.firstName, "First Name", 2, 50);
        validateLength("lastName", profile.lastName, "Last Name", 2, 50);

        if (profile.email.length === 0) {
            newErrors.email = "Required";
        } else if (!emailRegExp.test(profile.email)) {
            newErrors.email = "Invalid email format";
        } else {
            validateLength("email", profile.email, "Email", 2, 50);
        }

        /*const profileData = {
            id: profile.id,
            email: profile.email,
            name: profile.firstName,
            surname: profile.lastName,
            specialization: profile.specialization
        };

        try {
            await authApi.createExpert(profileData);
            showDialog("Expert created successfully", "success");
            setTimeout(() => {
                navigate(-1);
            }, 1000);
        } catch (error) {
            showDialog("Error while creating expert", "error");
        }


        try {
            const expert = await profilesApi.getAllExperts();
            const emailFound = expert.find(
                (exp) => exp.email === expert.email)
            if (emailFound) {
                newErrors.email = "Profile with given email already exists";
            }
        } catch (error) {
        }*/

        if (Object.keys(newErrors).length === 0) {
            const profileData = {
                id: profile.id,
                email: profile.email,
                name: profile.firstName,
                surname: profile.lastName,
                specialization: profile.specialization
            };

            authApi.createExpert(profileData).then(() => {
                showDialog("Expert created successfully", "success");
                setTimeout(() => {
                    navigate(-1);
                }, 1000);
            }).catch(() => {
                showDialog("Error while creating expert", "error");
            });
        } else {
            setErrors(newErrors);
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
                type="text"
                label="Id"
                value={profile.id}
                name="id"
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                error={Boolean(errors.id)}
                helperText={errors.id}
                required
                onChange={(e) => handleFieldChange("id", e.target.value)}
            />
            <TextField
                type="text"
                label="Email"
                value={profile ? profile.email : ""}
                name="email"
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
                onChange={(e) => handleFieldChange("email", e.target.value)}
            />
            <TextField
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
            <Autocomplete
                value={specialization}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        setSpecialization({
                            title: newValue,
                        });
                        handleFieldChange("specialization", newValue)
                    } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        setSpecialization({
                            title: newValue.inputValue,
                        });
                        handleFieldChange("specialization", newValue.inputValue)
                    } else {
                        setSpecialization(newValue);
                        handleFieldChange("specialization", newValue)
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const {inputValue} = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.title);
                    if (inputValue !== '' && !isExisting) {
                        filtered.push({
                            inputValue,
                            title: `Add "${inputValue}"`,
                        });
                    }
                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="specialization"
                options={ticketAreas.map((area) => {
                    return {
                        title: area,
                        inputValue: area,
                    };
                })}
                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    // Regular option
                    return option.title;
                }}
                renderOption={(props, option) => <li {...props}>{option.title}</li>}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                freeSolo
                renderInput={(params) => (
                    <TextField
                        {...params}
                        required
                        error={Boolean(errors.specialization)}
                        label="Specialization"
                    />
                )}
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
                    Create New Expert
                </Button>
            </Box>
        </Box>
    );
};

export default CreateExpertForm;
