import {Box, Grid, Typography, Paper} from "@mui/material";
import Header from "../../components/Header";
import {useTheme} from "@mui/material/styles";
import {tokens} from "../../theme";
import Button from "@mui/material/Button";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import IconButton from "@mui/material/IconButton";
import StatBox from "../../components/StatBox";
import {useContext, useEffect, useState} from "react";
import {useDialog} from "../../utils/DialogContext";
import OrdersAPI from "../../api/orders/ordersApi";
import {AuthContext} from "../../utils/AuthContext";
import TicketsAPI from "../../api/tickets/ticketsApi";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ProfilesAPI from "../../api/profiles/profilesApi";


const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [customers, setCustomers] = useState([]);
    const {showDialog} = useDialog();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let ordersData = [];
                if (currentUser.role === "Manager" || currentUser.role === "Expert")
                    ordersData = await OrdersAPI.getAllOrders();
                if (currentUser.role === "Client")
                    ordersData = await OrdersAPI.getOrdersByCustomerId(currentUser.email);
                setOrders(ordersData);
            } catch (error) {
                showDialog("Error while fetching orders", "error");
            }
        };
        fetchOrders()

        const fetchTickets = async () => {
            try {
                let ticketsData = [];
                if (currentUser.role === "Manager")
                    ticketsData = await TicketsAPI.getTickets();
                if (currentUser.role === "Expert")
                    ticketsData = await TicketsAPI.getTicketsByExpert(currentUser.email);
                if (currentUser.role === "Client")
                    ticketsData = await TicketsAPI.getTicketsByCustomer(currentUser.email);
                setTickets(ticketsData);
            } catch (error) {
                showDialog("Error while fetching tickets", "error");
            }
        }
        fetchTickets()

        const fetchCustomers = async () => {
            try {
                const customersData = await ProfilesAPI.getAllCustomers();
                setCustomers(customersData);
            } catch (error) {
                showDialog("Error while fetching customers", "error");
            }
        }
        fetchCustomers()
    }, [currentUser.id, currentUser.role, currentUser.email, showDialog]);

    return (
        <Box m="20px">
            {/* HEADER */}
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard"/>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="120px"
                gap="20px"
            >
                {/* ROW 1 */}
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={tickets && tickets.length}
                        subtitle="Tickets"
                        icon={
                            <SupportAgentOutlinedIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}}/>
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={orders && orders.reduce((acc, order) => acc + (order.product.price * order.quantity), 0) + " $"}
                        subtitle="Sales Obtained"
                        icon={
                            <ShoppingCartOutlinedIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}}/>
                        }
                    />
                </Box>
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
                            <ContactsOutlinedIcon sx={{color: colors.greenAccent[600], fontSize: "26px"}}/>
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title="1,325,134"
                        subtitle="Traffic Received"
                        progress="0.80"
                        increase="+43%"
                        icon={
                            <TrafficIcon
                                sx={{color: colors.greenAccent[600], fontSize: "26px"}}
                            />
                        }
                    />
                </Box>

                {/* ROW 2 */}
                <Box
                    gridColumn="span 8"
                    gridRow="span 2"
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
                                Revenue Generated
                            </Typography>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color={colors.greenAccent[500]}
                            >
                                $59,342.32
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton>
                                <DownloadOutlinedIcon
                                    sx={{fontSize: "26px", color: colors.greenAccent[500]}}
                                />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box height="250px" m="-20px 0 0 0">
                    </Box>
                </Box>
                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                    overflow="auto"
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom={`4px solid ${colors.primary[500]}`}
                        colors={colors.grey[100]}
                        p="15px"
                    >
                        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                            Recent Orders
                        </Typography>
                    </Box>
                    {orders && orders.map((order, i) => (
                        <Box
                            key={`${order.id}-${i}`}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid ${colors.primary[500]}`}
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
                                    {order.customer.name + " " + order.customer.surname}
                                </Typography>
                            </Box>
                            <Box color={colors.grey[100]}>{new Date(order.date).toDateString()}</Box>
                            <Box
                                backgroundColor={colors.greenAccent[500]}
                                p="5px 10px"
                                borderRadius="4px"
                            >
                                ${order.product.price * order.quantity}
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* ROW 3 */}
                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                >
                    <Typography
                        variant="h5"
                        fontWeight="600"
                        sx={{padding: "30px 30px 0 30px"}}
                    >
                        Sales Quantity
                    </Typography>
                    <Box height="250px" mt="-20px">
                    </Box>
                </Box>
            </Box>
        </Box>
        /*<Box m="20px">
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard"/>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Paper
                            sx={{
                                backgroundColor: colors.primary[400],
                                color:
                                    theme.palette.mode === "dark"
                                        ? colors.primary[100]
                                        : colors.primary[500],
                                padding: "20px",
                                borderRadius: "10px",
                                height: "35vh",
                            }}
                        >
                            <Typography variant="h3">Tickets</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper
                            sx={{
                                backgroundColor: colors.greenAccent[800],
                                color:
                                    theme.palette.mode === "dark"
                                        ? colors.primary[100]
                                        : colors.primary[500],
                                padding: "20px",
                                borderRadius: "10px",
                                height: "35vh",
                            }}
                        >
                            <Typography variant="h3">2nd Square</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper
                            sx={{
                                backgroundColor: colors.blueAccent[600],
                                color:
                                    theme.palette.mode === "dark"
                                        ? colors.primary[100]
                                        : colors.primary[500],
                                padding: "20px",
                                borderRadius: "10px",
                                height: "35vh",
                            }}
                        >
                            <Typography variant="h3">3rd Square</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper
                            sx={{
                                backgroundColor: colors.redAccent[800],
                                color:
                                    theme.palette.mode === "dark"
                                        ? colors.primary[100]
                                        : colors.primary[500],
                                padding: "20px",
                                borderRadius: "10px",
                                height: "35vh",
                            }}
                        >
                            <Typography variant="h3">4th Square</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>*/
    );
};

export default Dashboard;
