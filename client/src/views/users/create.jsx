import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import CreateUserForm from "../../components/forms/CreateUserForm";
import { dataGridStyles } from "../../styles/dataGridStyles";
import CreateExpertForm from "../../components/forms/CreateExpertForm";

const CreateUser = () => {
    const theme = useTheme();

    return (
        <Box m="20px">
            <Header title="CREATE USER" subtitle="Create a New User Profile"/>
            <Box m="40px 0 0 0" height="70h" sx={dataGridStyles(theme)}>
                 <CreateUserForm />
            </Box>
        </Box>
    );
};

const CreateExpert = () => {
    const theme = useTheme();

    return (
        <Box m="20px">
            <Header title="CREATE EXPERT" subtitle="Create a New Expert Profile"/>
            <Box m="40px 0 0 0" height="70h" sx={dataGridStyles(theme)}>
                <CreateExpertForm />
            </Box>
        </Box>
    );
};
export { CreateUser, CreateExpert };
