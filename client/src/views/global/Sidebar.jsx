import {useContext, useEffect, useState} from "react";
import {
    Sidebar as ProSidebar,
    Menu,
    MenuItem,
    sidebarClasses,
    menuClasses,
} from "react-pro-sidebar";
import {Avatar, Box, IconButton, Typography, useTheme} from "@mui/material";
import {Link, useLocation} from "react-router-dom";
import {tokens} from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {AuthContext} from "../../utils/AuthContext";

const Item = ({title, slug, to, icon, selected, setSelected}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Link to={to} style={{textDecoration: "none"}}>
            <MenuItem
                active={selected === slug}
                style={{color: colors.grey[100]}}
                onClick={() => setSelected(slug)}
                icon={icon}
                component={"span"}
            >
                <Typography>{title}</Typography>
            </MenuItem>
        </Link>
    );
};

const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useContext(AuthContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const [selected, setSelected] = useState("");

    useEffect(() => {
      setSelected(
        location.pathname.split("/")[1] === "" 
        ? "dashboard"
        : location.pathname.split("/")[1]
      );
    }, [location.pathname]);

    return (
        <Box
            sx={{
                ".ps-sidebar-root": {
                    borderRightWidth: "0px",
                    height: "100%",
                },
            }}
        >
            <ProSidebar
                collapsed={isCollapsed}
                rootStyles={{
                    [`.${sidebarClasses.container}`]: {
                        backgroundColor: `${colors.primary[400]} !important`,
                    },
                    [`.${menuClasses.active}`]: {
                        color: `${colors.blueAccent[400]} !important`,
                    },
                    [`.${menuClasses.button}`]: {
                        padding: "5px 35px 5px 20px !important",
                    },
                    [`.${menuClasses.button}:hover`]: {
                        backgroundColor: `${colors.blueAccent[700]} !important`,
                    },
                }}
            >
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon/> : undefined}
                        style={{
                            margin: "0 0 20px 0",
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-around"
                                alignItems="center"
                                ml="15px"
                            >
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon/>
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {/* USER */}
                    {!isCollapsed ? (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <Avatar
                                    alt="profile-user"
                                    sx={{
                                        width: "100px",
                                        height: "100px",
                                        fontSize: "45px",
                                        bgcolor: colors.greenAccent[300],
                                    }}
                                >
                                    {currentUser.name?.charAt(0).toUpperCase() || ""}
                                    {currentUser.surname?.charAt(0).toUpperCase() || ""}
                                </Avatar>
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{m: "10px 0 10px 0"}}
                                >
                                    {currentUser?.name || ""} <br/> {currentUser?.surname || ""}
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[400]}>
                                    {currentUser?.role}
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Box>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <Avatar
                                    alt="profile-user"
                                    sx={{
                                        width: "50px",
                                        height: "50px",
                                        fontSize: "25px",
                                        margin: "5px 0",
                                        bgcolor: colors.greenAccent[300],
                                    }}
                                >
                                    {currentUser.name?.charAt(0).toUpperCase() || ""}
                                    {currentUser.surname?.charAt(0).toUpperCase() || ""}
                                </Avatar>
                            </Box>
                        </Box>
                    )}

                    {/* MENU ITEMS */}
                    <Box>
                        <Item
                            title="Dashboard"
                            slug="dashboard"
                            to="/"
                            icon={<HomeOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        {(currentUser.role === "Manager" || currentUser.role === "Expert") && (
                            <Item
                                title="Users"
                                slug="users"
                                to="users"
                                icon={<ContactsOutlinedIcon/>}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        )}
                        <Item
                            title="Products"
                            slug="products"
                            to="/products"
                            icon={<Inventory2OutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        {(currentUser.role === "Manager" || currentUser.role === "Client") && (
                            <Item
                                title={
                                    currentUser.role === "Client" ? "My Orders" : "Orders"
                                }
                                slug="orders"
                                to="/orders"
                                icon={<ShoppingCartOutlinedIcon/>}
                                selected={selected}
                                setSelected={setSelected}
                            />)}
                        <Item
                            title={
                                currentUser.role === "Client" ? "My Tickets" : "Tickets"
                            }
                            slug="tickets"
                            to="/tickets"
                            icon={<SupportAgentOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;
