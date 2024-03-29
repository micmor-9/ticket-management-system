import {Box, Typography} from "@mui/material";
import Header from "../../components/Header";
import {useTheme} from "@mui/material/styles";
import {tokens} from "../../theme";
import StatBox from "../../components/StatBox";
import {useContext, useEffect, useState} from "react";
import {useDialog} from "../../utils/DialogContext";
import OrdersAPI from "../../api/orders/ordersApi";
import {AuthContext} from "../../utils/AuthContext";
import TicketsAPI from "../../api/tickets/ticketsApi";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import ProfilesAPI from "../../api/profiles/profilesApi";
import TicketsPieChart from "../../components/TicketsPieChart";
import ExpertsBarChart from "../../components/ExpertsBarChart";
import {useNavigate} from "react-router-dom";

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [experts, setExperts] = useState([]);
    const {showDialog} = useDialog();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser.role) {
            const fetchOrders = async () => {
                try {
                    let ordersData = [];
                    if (currentUser.role === "Manager")
                        ordersData = await OrdersAPI.getAllOrders();
                    if (currentUser.role === "Client")
                        ordersData = await OrdersAPI.getOrdersByCustomerId(
                            currentUser.email
                        );
                    ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setOrders(ordersData);
                } catch (error) {
                    showDialog("Error while fetching orders", "error");
                }
            };
            fetchOrders();

            const fetchTickets = async () => {
                try {
                    let ticketsData = [];
                    if (currentUser.role === "Manager")
                        ticketsData = await TicketsAPI.getTickets();
                    if (currentUser.role === "Expert")
                        ticketsData = await TicketsAPI.getTicketsByExpert(currentUser.id);
                    if (currentUser.role === "Client")
                        ticketsData = await TicketsAPI.getTicketsByCustomer(
                            currentUser.email
                        );
                    ticketsData.sort(
                        (a, b) =>
                            new Date(b.creationTimestamp) - new Date(a.creationTimestamp)
                    );
                    setTickets(ticketsData);
                } catch (error) {
                    showDialog("Error while fetching tickets", "error");
                }
            };
            fetchTickets();

            const fetchCustomers = async () => {
                try {
                    const customersData = await ProfilesAPI.getAllCustomers();
                    setCustomers(customersData);
                } catch (error) {
                    showDialog("Error while fetching customers", "error");
                }
            };
            if (currentUser.role !== "Client") {
                fetchCustomers();
            }

            if (currentUser.role !== "Client") {
                const fetchExperts = async () => {
                    try {
                        const expertsData = await ProfilesAPI.getAllExperts();
                        setExperts(expertsData);
                    } catch (error) {
                        showDialog("Error while fetching experts", "error");
                    }
                };
                fetchExperts();
            }
        }
    }, [currentUser, showDialog]);

    return (
        <Box m="20px">
            {/* HEADER */}
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard"/>

            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="130px"
                gap="20px"
            >
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={tickets && tickets.length}
                        subtitle={currentUser.role === "Client" ? "My Tickets" : "Tickets"}
                        icon={
                            <SupportAgentOutlinedIcon
                                sx={{color: colors.greenAccent[600], fontSize: "26px"}}
                            />
                        }
                    />
                </Box>
                {currentUser.role !== "Expert" && (
                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title={
                                currentUser.role === "Client"
                                    ? orders.length
                                    : orders &&
                                    orders.reduce(
                                        (acc, order) =>
                                            acc + order.product.price * order.quantity,
                                        0
                                    ) + " $"
                            }
                            subtitle={
                                currentUser.role === "Client" ? "My Orders" : "Sales Obtained"
                            }
                            icon={
                                <ShoppingCartOutlinedIcon
                                    sx={{color: colors.greenAccent[600], fontSize: "26px"}}
                                />
                            }
                        />
                    </Box>
                )}
                {currentUser.role !== "Client" && (
                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title={customers && customers.length}
                            subtitle="Customers"
                            icon={
                                <ContactsOutlinedIcon
                                    sx={{color: colors.greenAccent[600], fontSize: "26px"}}
                                />
                            }
                        />
                    </Box>
                )}
                {currentUser.role !== "Client" ? (
                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title={experts && experts.length}
                            subtitle="Experts"
                            icon={
                                <EngineeringOutlinedIcon
                                    sx={{color: colors.greenAccent[600], fontSize: "26px"}}
                                />
                            }
                        />
                    </Box>
                ) : (
                    <Box gridColumn="span 3"/>
                )}

                {currentUser.role !== "Client" && (
                    <Box
                        gridColumn="span 4"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                    >
                        <Box
                            mt="25px"
                            p="0 30px"
                            display="flex "
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box>
                                <Typography
                                    variant="h5"
                                    fontWeight="600"
                                    color={colors.grey[100]}
                                >
                                    {currentUser.role === "Manager"
                                        ? "Tickets By Status"
                                        : "My Tickets By Status"}
                                </Typography>
                            </Box>
                        </Box>
                        <Box height="300px" mt="30px" sx={{textAlign: "center"}}>
                            {tickets.length ? (
                                <TicketsPieChart tickets={tickets}/>
                            ) : (
                                "No tickets found"
                            )}
                        </Box>
                    </Box>
                )}
                {currentUser.role !== "Expert" && (
                    <Box
                        gridColumn="span 4"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                        overflow="auto"
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid ${
                                theme.palette.mode === "dark"
                                    ? colors.primary[500]
                                    : colors.grey[700]
                            }`}
                            colors={colors.grey[100]}
                            p="15px"
                        >
                            <Typography
                                color={colors.grey[100]}
                                variant="h5"
                                fontWeight="600"
                            >
                                Recent Orders
                            </Typography>
                        </Box>
                        <Box overflow="auto">
                            {orders &&
                                orders.map((order, i) => (
                                    <Box
                                        key={`${order.id}-${i}`}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        borderBottom={`2px solid ${
                                            theme.palette.mode === "dark"
                                                ? colors.primary[500]
                                                : colors.grey[700]
                                        }`}
                                        p="15px"
                                    >
                                        <Box>
                                            <Typography
                                                color={colors.greenAccent[500]}
                                                variant="h5"
                                                fontWeight="600"
                                            >
                                                #{order.id}
                                            </Typography>
                                            <Typography color={colors.grey[100]}>
                                                {currentUser.role === "Client"
                                                    ? order.product.description
                                                    : order.customer.name + " " + order.customer.surname}
                                            </Typography>
                                        </Box>
                                        <Box color={colors.grey[100]}>
                                            {new Date(order.date).toDateString()}
                                        </Box>
                                        <Box
                                            backgroundColor={colors.greenAccent[500]}
                                            p="5px 10px"
                                            borderRadius="4px"
                                        >
                                            ${order.product.price * order.quantity}
                                        </Box>
                                    </Box>
                                ))}
                            {orders.length === 0 && (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height="100%"
                                    sx={{marginTop: "30px"}}
                                >
                                    No orders found
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                {currentUser.role !== "Manager" && (
                    <Box
                        gridColumn="span 4"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                        overflow="auto"
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid ${
                                theme.palette.mode === "dark"
                                    ? colors.primary[500]
                                    : colors.grey[700]
                            }`}
                            colors={colors.grey[100]}
                            p="15px"
                        >
                            <Typography
                                color={colors.grey[100]}
                                variant="h5"
                                fontWeight="600"
                            >
                                Recent Tickets
                            </Typography>
                        </Box>
                        <Box overflow="auto">
                            {tickets &&
                                tickets.map((ticket, i) => (
                                    <Box
                                        key={`${ticket.id}-${i}`}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        borderBottom={`2px solid ${
                                            theme.palette.mode === "dark"
                                                ? colors.primary[500]
                                                : colors.grey[700]
                                        }`}
                                        p="15px"
                                        onClick={() => {
                                            navigate(`/tickets/${ticket.id}`);
                                        }}
                                        style={{cursor: "pointer"}}
                                    >
                                        <Box>
                                            <Typography
                                                color={colors.greenAccent[500]}
                                                variant="h5"
                                                fontWeight="600"
                                            >
                                                #{ticket.id}
                                            </Typography>
                                            <Typography color={colors.grey[100]}>
                                                {currentUser.role === "Client" ? (
                                                    ticket.expert ?
                                                        (ticket.expert.name +
                                                            " " +
                                                            ticket.expert.surname) : "No expert assigned"
                                                ) : (
                                                    ticket.customer.name +
                                                    " " +
                                                    ticket.customer.surname
                                                )}
                                            </Typography>
                                        </Box>
                                        <Box color={colors.grey[100]}>
                                            {new Date(ticket.creationTimestamp).toDateString()}
                                        </Box>
                                        <Box
                                            backgroundColor={colors.status[ticket.status]}
                                            p="5px 10px"
                                            borderRadius="4px"
                                        >
                                            {ticket.status.replace("_", " ")}
                                        </Box>
                                    </Box>
                                ))}
                            {tickets.length === 0 && (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height="100%"
                                    sx={{marginTop: "30px"}}
                                >
                                    No tickets found
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                {currentUser.role === "Manager" && (
                    <Box
                        gridColumn="span 4"
                        gridRow="span 3"
                        backgroundColor={colors.primary[400]}
                    >
                        <Typography
                            variant="h5"
                            fontWeight="600"
                            sx={{padding: "30px 30px 0 30px"}}
                        >
                            Experts Workload
                        </Typography>
                        <Box mt={"10px"}>
                            <ExpertsBarChart experts={experts} tickets={tickets}/>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Dashboard;
