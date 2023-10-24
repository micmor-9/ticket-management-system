import {
    Box,
    Button,
    Container,
    Input,
    TextField,
    colors,
    useMediaQuery,
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import Header from "../Header";
import {useTheme} from "@emotion/react";
import {tokens} from "../../theme";
import OrdersAPI from "../../api/orders/ordersApi";
import {useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../utils/AuthContext";
import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import TicketsAPI from "../../api/tickets/ticketsApi";

const CreateTicket = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {orderId} = useParams();
    const [order, setOrder] = useState("");
    const navigate = useNavigate();
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await OrdersAPI.getOrderByOrderId(orderId);
                setOrder(orderData);
            } catch (error) {
            }
        };
        fetchOrder();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const createTicketRequest = {
            id: null,
            creationTimestamp: null,
            issueDescription: description,
            priority: null,
            status: null,
            expertId: null,
            productId: order.product.id,
            customerId: order.customer.email,
        };

        TicketsAPI.createTicket(createTicketRequest)
            .then((response) => {
                console.log("Ticket created successfully");
                setTimeout(navigate("/orders"), 1000);
            })
            .catch((error) => {
                console.log(error);
                alert("Ticket creation error");
            });
    };

    const disabledTextField = {
        "& .Mui-disabled": {
            color:
                theme.palette.mode === "dark"
                    ? colors.greenAccent[300] + " !important"
                    : colors.greenAccent[200] + " !important",
        },
        "& .MuiInputBase-input": {
            color:
                theme.palette.mode === "dark"
                    ? colors.greenAccent[300]
                    : colors.greenAccent[200],
        },
        gridColumn: "span 2",
    };

    return (
        <Box m="20px">
            <Header title="NEW TICKET" subtitle="Open a new Ticket"/>
            {order && (
                <Box
                    sx={{
                        backgroundColor: colors.primary[400],
                        color:
                            theme.palette.mode === "dark"
                                ? colors.primary[100]
                                : colors.primary[500],
                        borderRadius: "10px",
                        padding: "20px",
                    }}
                    component="form"
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                >
                    <TextField
                        label="Order ID"
                        value={order.id}
                        focused
                        disabled
                        sx={disabledTextField}
                    />
                    <TextField
                        label="Product"
                        value={order.product.name}
                        disabled
                        sx={disabledTextField}
                    />
                    <TextField
                        label="Customer Name"
                        value={order.customer.name}
                        disabled
                        sx={disabledTextField}
                    />
                    <TextField
                        label="Customer Surname"
                        value={order.customer.surname}
                        disabled
                        sx={disabledTextField}
                    />
                    <TextField
                        label="Order Date"
                        value={new Date(order.date).toLocaleString()}
                        disabled
                        sx={disabledTextField}
                    />
                    <TextField
                        label="Warranty Duration"
                        value={new Date(order.warrantyDuration).toLocaleString()}
                        disabled
                        sx={disabledTextField}
                    />
                    <TextField
                        id="description"
                        multiline
                        label="Insert description"
                        required
                        value={description}
                        sx={{
                            "& .Mui-required": {
                                color: colors.greenAccent[300],
                            },
                            gridColumn: "span 4",
                        }}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                    <Box display="flex" justifyContent="flex-end" gridColumn="span 4">
                        <Button
                            variant="contained"
                            startIcon={<DeleteIcon/>}
                            sx={{
                                backgroundColor: colors.redAccent[600],
                                margin: "0 20px 0 0",
                                "&:hover": {
                                    backgroundColor: colors.redAccent[500],
                                },
                            }}
                            onClick={() => setDescription("")}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            startIcon={<SendIcon/>}
                            sx={{
                                backgroundColor: colors.greenAccent[600],
                                marginRight: "0px",
                                "&:hover": {
                                    backgroundColor: colors.greenAccent[400],
                                },
                            }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default CreateTicket;
