import {Box, Typography, useTheme} from "@mui/material";
import {tokens} from "../theme";

const StatusBadge = ({statusValue}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box
            width="60%"
            m="0 auto 0 0"
            p="5px"
            display="flex"
            justifyContent={"center"}
            backgroundColor={colors.status[statusValue]}
            borderRadius={"5px"}
        >
            <Typography color={colors.primary[400]}>
                {statusValue.replace("_", " ")}
            </Typography>
        </Box>
    )
}

export default StatusBadge;