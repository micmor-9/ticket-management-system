import {Box, IconButton, useTheme} from "@mui/material";
import {useContext, useState} from "react";
import {ColorModeContext, tokens} from "../../theme";
import {InputBase} from "@mui/material";
import {Menu, MenuItem} from "@mui/material";
import {useNavigate} from "react-router-dom";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {NotificationsContext} from "../../utils/NotificationsContext";
import {AuthContext} from "../../utils/AuthContext";
import NotificationsPanel from "../../components/NotificationsPanel";


const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const [, logout] = useContext(AuthContext);
    const navigate = useNavigate();

    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const openMenu = Boolean(anchorElMenu);
    const handleClick = (event) => {
        setAnchorElMenu(event.currentTarget);
    };

    const [anchorElNotifications, setAnchorElNotifications] = useState(null);
    const [openNotifications, setOpenNotifications] = useState(false);
    const handleClickNotifications = (event) => {
        setOpenNotifications(!openNotifications)
        setAnchorElNotifications(openNotifications ? null : event.currentTarget);
    };

    const [notifications, setNotifications] = useContext(NotificationsContext);

    const handleClose = () => {
        setAnchorElMenu(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        setTimeout(navigate("/login"), 1000);
    };

    const handleMyAccount = () => {
        navigate("/myaccount");
        handleClose();
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="3px"
            >
                <InputBase sx={{ml: 2, flex: 1}} placeholder="Search"/>
                <IconButton type="button" sx={{p: 1}}>
                    <SearchIcon/>
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon/>
                    ) : (
                        <LightModeOutlinedIcon/>
                    )}
                </IconButton>
                <IconButton aria-controls={openNotifications ? "notifications-popper" : undefined}
                            aria-haspopup="true"
                            aria-expanded={openNotifications ? "true" : undefined}
                            onClick={handleClickNotifications}>
                    <NotificationsOutlinedIcon/>
                </IconButton>
                <NotificationsPanel open={openNotifications} anchorEl={anchorElNotifications}
                                    setOpenNotifications={setOpenNotifications}
                                    notifications={notifications} setNotifications={setNotifications}/>
                <IconButton>
                    <SettingsOutlinedIcon/>
                </IconButton>
                <IconButton
                    aria-controls={openMenu ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined}
                    onClick={handleClick}
                >
                    <PersonOutlinedIcon/>
                </IconButton>
            </Box>
            <Menu
                id="basic-menu"
                anchorEl={anchorElMenu}
                open={openMenu}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem onClick={handleMyAccount}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
};

export default Topbar;
