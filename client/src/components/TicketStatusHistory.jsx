import {
    Box, Stack,
    Typography, useTheme
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import LoopIcon from '@mui/icons-material/Loop';
import BuildIcon from '@mui/icons-material/Build';
import RemoveIcon from '@mui/icons-material/Remove';
import {tokens} from "../theme";

const TicketStatusHistory = ({history}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const iconStyles = {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        padding: "10px",
        margin: "5px 10px 0 0",
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage:
            'linear-gradient( 136deg, #3e4396 0%, #2e7c67 50%, #4cceac 100%);',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    }

    const icons = {
        'OPEN': <AddIcon sx={iconStyles}/>,
        'IN_PROGRESS': <BuildIcon sx={iconStyles}/>,
        'CLOSED': <RemoveIcon sx={iconStyles}/>,
        'RESOLVED': <CheckIcon sx={iconStyles}/>,
        'REOPENED': <LoopIcon sx={iconStyles}/>,
    };

    return (
        <Box mt={3} sx={{
            overflowY: "auto",
            height: "33vh",
            position: "relative",
            "&::-webkit-scrollbar": {
                width: "5px",
            },
            "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            "&::-webkit-scrollbar-thumb:active": {
                backgroundColor: "rgba(0, 0, 0, 0.4)",
            },
        }}>
            {history && history.length > 0 ? (
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={0.5}
                >
                    {history.map((status) => (
                        <Box sx={{display: "flex", flexDirection: "row"}} mb={2}>
                            <Box>
                                {icons[String(status.status)]}
                            </Box>
                            <Box>
                                <Typography variant={"h4"}
                                            sx={{
                                                fontWeight: "bold",
                                                color: colors.greenAccent[400]
                                            }}>{status.status.replace("_", " ")}</Typography>
                                <Typography variant={"h5"}>{status.description}</Typography>
                                {status.expert && <Typography
                                    variant={"subtitle1"}
                                    sx={{color: colors.greenAccent[500]}}>{status.expert.name + " " + status.expert.surname}</Typography>}
                                <Typography
                                    variant={"subtitle2"}
                                    sx={{color: colors.primary[200]}}>{new Date(status.statusTimestamp).toLocaleString().replace(",", "")}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>) : <Typography variant={"h4"}>No status history</Typography>}
        </Box>
    );
}

export default TicketStatusHistory;