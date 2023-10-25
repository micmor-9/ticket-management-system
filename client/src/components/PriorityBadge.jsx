import {Box, Tooltip, Typography, useTheme} from "@mui/material";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import {tokens} from "../theme";

const PriorityBadge = ({priority}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            width="60%"
            m="0 auto 0 0"
            display="flex"
            backgroundColor={"transparent"}
        >
            <Tooltip
                title={
                    priority === "LOW"
                        ? "Low"
                        : priority === "MEDIUM"
                            ? "Medium"
                            : priority === "HIGH" ? "High" : "Not assigned yet"
                }
            >
                <Typography color={colors.priority[priority]}>
                    {priority === "LOW" ? (
                        <SouthOutlinedIcon/>
                    ) : priority === "MEDIUM" ? (
                        <EastOutlinedIcon/>
                    ) : priority === "HIGH" ? (
                        <NorthOutlinedIcon/>
                    ) : (
                        <QuestionMarkOutlinedIcon/>
                    )}
                </Typography>
            </Tooltip>
        </Box>
    )
}

export default PriorityBadge;