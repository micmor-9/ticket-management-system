import {
    Box, Button, FormControl, InputLabel, MenuItem, Select, TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import React, {useEffect, useState} from "react";
import TicketsAPI from "../../api/tickets/ticketsApi";
import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@emotion/react";
import {tokens} from "../../theme";
import OrdersAPI from "../../api/orders/ordersApi";
import {useAuth} from "../../utils/AuthContext";
import {useDialog} from "../../utils/DialogContext";

const CreateTicketForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [ticketArea, setTicketArea] = useState("");
    const [descriptionError, setDescriptionError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const [currentUser] = useAuth();
    const {orderId} = useParams();
    const [order, setOrder] = useState();
    const [orderTemp, setOrderTemp] = useState(null);
    const [orderError, setOrderError] = useState(false);
    const [orders, setOrders] = useState([]);
    const [orderSelected, setOrderSelected] = useState("");
    const {showDialog} = useDialog();
    const [ticket, setTicket] = useState({
        orderId: "", product: "", name: "", surname: "",
    });
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                /* Coming from Orders, I have already an orderId */
                if (orderId) {
                    const orderData = await OrdersAPI.getOrderByOrderId(orderId);
                    setOrder(orderData);
                }
                if (currentUser.role === "Client") {
                    const userOrders = await OrdersAPI.getOrdersByCustomerId(currentUser.email);
                    setOrders(userOrders);
                } else if (currentUser.role === "Manager") {
                    const ord = await OrdersAPI.getAllOrders();
                    setOrders(ord);
                }
            } catch (error) {}
        };
        fetchOrder();
    }, [orderId, currentUser.role, currentUser.id, currentUser.email]);
    useEffect(() => {
        if (orderSelected) {
            const fetchOrder = async () => {
                try {
                    const orderData = await OrdersAPI.getOrderByOrderId(orderSelected);
                    setOrderTemp(orderData);
                } catch (error) {
                }
            }
            fetchOrder();
        }
    }, [orderSelected]);
    const validateForm = () => {
        const currentDate = new Date().toISOString();
        let isValid = true;
        if (!order) {
            if (currentDate > orderTemp.warrantyDuration) {
                setOrderError("Warranty expired");
                isValid = false;
            }
        }
        if (!description) {
            setDescriptionError(true);
            isValid = false;
        } else {
            setDescriptionError(false);
        }

        if (!ticketArea) {
            setCategoryError(true);
            isValid = false;
        } else {
            setCategoryError(false);
        }
        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            const createTicketRequest = {
                id: null,
                creationTimestamp: null,
                issueDescription: description,
                priority: null,
                status: null,
                expertId: null,
                productId: order ? order.product.id : orderTemp.product.id,
                customerId: order ? order.customer.email : orderTemp.customer.email,
                category: ticketArea,
            };

            TicketsAPI.createTicket(createTicketRequest)
                .then((response) => {
                    setTimeout(navigate(-1), 1000);
                    showDialog("Ticket created successfully", "success");
                })
                .catch((error) => {
                    console.log(error);
                    alert("Ticket creation error");
                });
        }
    };

    const disabledTextFieldStyle = {
        "& .Mui-disabled": {
            color: theme.palette.mode === "dark" ? colors.greenAccent[300] + " !important" : colors.greenAccent[200] + " !important",
        }, "& .MuiInputBase-input": {
            color: theme.palette.mode === "dark" ? colors.greenAccent[300] : colors.greenAccent[200],
        }, gridColumn: "span 2",
    };

    const ticketAreas = ["Battery", "Display", "Keyboard", "Mouse", "Power Supply",];

    const handleFieldChange = (fieldName, value) => {
        setTicket({...ticket, [fieldName]: value});
    };
    const handleChangeAreaTicket = (event) => {
        setTicketArea(event.target.value);
    };
    return (<Box
        sx={{
            backgroundColor: colors.primary[400],
            color: theme.palette.mode === "dark" ? colors.primary[100] : colors.primary[500],
            borderRadius: "10px",
            padding: "20px",
        }}
        component="form"
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
    >
        {orderId ? (<TextField
            label="Order ID"
            value={orderId}
            disabled
            sx={disabledTextFieldStyle}
            error={orderError !== false}
            helperText={orderError}
        />) : (<FormControl sx={{gridColumn: "span 2"}}
                            error={orderError !== false}
                            required>
            <InputLabel
                id="demo-simple-select-label"
                required
                sx={{
                    gridColumn: "span 2",
                    color: categoryError ? colors.redAccent[600] : colors.greenAccent[300],
                    backgroundColor: colors.primary[400],
                }}
            >
                Order
            </InputLabel>
            <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={orderSelected}
                label="Order"
                onChange={(event) => {
                    setOrderSelected(event.target.value);
                    handleFieldChange("orderId", event.target.value);
                }}
            >
                {orders.map((orderItem) => (<MenuItem key={orderItem.id} value={orderItem.id}>
                    {orderItem.id}
                </MenuItem>))}
            </Select>
        </FormControl>)}
        <TextField
            label="Product"
            value={order ? order.product.name : orderTemp && orderTemp.product.name ? orderTemp.product.name : ""}
            disabled={order != null && ticket.orderId === ""}
            sx={disabledTextFieldStyle}
            onChange={(e) => handleFieldChange("product", e.target.value)}
        />
        <TextField
            label="Customer Name"
            value={order ? order.customer.name : orderTemp && orderTemp.customer.name ? orderTemp.customer.name : currentUser?.role === "Client" ? currentUser.name : ticket.name}
            disabled={order != null || currentUser?.role === "Client"}
            sx={disabledTextFieldStyle}
            onChange={(e) => handleFieldChange("name", e.target.value)}
        />
        <TextField
            label="Customer Surname"
            value={order ? order.customer.surname : orderTemp && orderTemp.customer.surname ? orderTemp.customer.surname : currentUser?.role === "Client" ? currentUser.surname : ticket.surname}
            disabled={order != null || currentUser?.role === "Client"}
            sx={disabledTextFieldStyle}
            onChange={(e) => handleFieldChange("surname", e.target.value)}
        />
        <TextField
            id="description"
            multiline
            label="Insert description"
            required
            value={description}
            sx={{
                "& .Mui-required": {
                    color: descriptionError ? colors.redAccent[600] : colors.greenAccent[300],
                }, gridColumn: "span 3",
            }}
            onChange={(event) => {
                setDescription(event.target.value);
                setDescriptionError(false);
            }}
        />

        <FormControl sx={{gridColumn: "span 1"}} required>
            <InputLabel
                id="demo-simple-select-label"
                required
                sx={{
                    gridColumn: "span 1",
                    color: categoryError ? colors.redAccent[600] : colors.greenAccent[300],
                    backgroundColor: colors.primary[400],
                }}
            >
                Area
            </InputLabel>
            <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={ticketArea}
                label="Area"
                onChange={(event) => {
                    handleChangeAreaTicket(event);
                    setCategoryError(false);
                }}
            >
                {ticketAreas.map((category) => (<MenuItem key={category} value={category}>
                    {category}
                </MenuItem>))}
            </Select>
        </FormControl>

        <Box display="flex" justifyContent="flex-end" gridColumn="span 4">
            <Button
                variant="contained"
                startIcon={<DeleteIcon/>}
                sx={{
                    backgroundColor: colors.redAccent[600], margin: "0 20px 0 0", "&:hover": {
                        backgroundColor: colors.redAccent[500],
                    },
                }}
                onClick={() => {
                    navigate(-1);
                }}
            >
                Cancel
            </Button>
            <Button
                variant="contained"
                type="submit"
                startIcon={<SendIcon/>}
                sx={{
                    backgroundColor: colors.greenAccent[600], marginRight: "0px", "&:hover": {
                        backgroundColor: colors.greenAccent[400],
                    },
                }}
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </Box>
    </Box>);
};

export default CreateTicketForm;
