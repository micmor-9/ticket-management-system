import {
    Divider,
    Grow,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Popper,
    Typography,
    useTheme
} from "@mui/material";
import {tokens} from "../theme";
import {useNavigate} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import {useEffect, useRef} from "react";

const NotificationsPanel = ({open, anchorEl, setOpenNotifications, notifications, setNotifications}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const popperRef = useRef(null);

    const notificationIcons = {
        "users": <ContactsOutlinedIcon/>,
        "products": <Inventory2OutlinedIcon/>,
        "orders": <ShoppingCartOutlinedIcon/>,
        "tickets": <SupportAgentOutlinedIcon/>
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (popperRef.current && !popperRef.current.contains(event.target)) {
                setOpenNotifications(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popperRef]);

    return <Popper ref={popperRef} id="notifications-popper" open={open} placement={"bottom-end"}
                   anchorEl={anchorEl} transition>
        {({TransitionProps}) => (
            <Grow {...TransitionProps} style={{transformOrigin: 'right'}} timeout={350}>
                <Paper elevation={2} variant="elevation" square={false}
                       sx={{
                           "width": "320px",
                           "bgcolor": colors.primary[400],
                           "marginTop": "10px",
                       }}>
                    <List>
                        {notifications && notifications.length > 0 ? (
                                notifications.map((notification, idx) => (
                                    <>
                                        <ListItem key={"notification-" + idx} onClick={() => {
                                            navigate(notification.url);
                                        }} sx={{"cursor": "pointer"}}>
                                            <ListItemAvatar>
                                                <Avatar sx={{bgcolor: colors.greenAccent[600]}}>
                                                    {notificationIcons[notification.url.split("/")[1]]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={notification.title}
                                                secondary={notification.description}
                                            />
                                        </ListItem>
                                        {idx !== (notifications.length - 1) && <Divider/>}</>
                                ))) :
                            <ListItem><Typography variant={"h4"}>No notifications</Typography></ListItem>
                        }
                    </List>
                </Paper>
            </Grow>
        )}
    </Popper>;
}

export default NotificationsPanel;