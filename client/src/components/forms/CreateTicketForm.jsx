import {Box, Button, TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import React, {useEffect, useState} from "react";
import TicketsAPI from "../../api/tickets/ticketsApi";
import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@emotion/react";
import {tokens} from "../../theme";
import OrdersAPI from "../../api/orders/ordersApi";

const CreateTicketForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [description, setDescription] = useState("");

    const {orderId} = useParams();
    const [order, setOrder] = useState();

    useEffect(() => {
        const fetchOrder = async () => {
            if (orderId) {
                try {
                    const orderData = await OrdersAPI.getOrderByOrderId(orderId);
                    setOrder(orderData);
                } catch (error) {
                }
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
                setTimeout(navigate(-1), 1000);
            })
            .catch((error) => {
                console.log(error);
                alert("Ticket creation error");
            });
    };

    const disabledTextFieldStyle = {
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
                value={order ? order.id : ""}
                focused
                disabled={order != null}
                sx={disabledTextFieldStyle}
            />
            <TextField
                label="Product"
                value={order ? order.product.name : ""}
                disabled={order != null}
                sx={disabledTextFieldStyle}
            />
            <TextField
                label="Customer Name"
                value={order ? order.customer.name : ""}
                disabled={order != null}
                sx={disabledTextFieldStyle}
            />
            <TextField
                label="Customer Surname"
                value={order ? order.customer.surname : ""}
                disabled={order != null}
                sx={disabledTextFieldStyle}
            />
            {/*<TextField
                label="Order Date"
                value={order ? new Date(order.date).toLocaleString() : null}
                disabled={!order}
                sx={disabledTextFieldStyle}
            />
            <TextField
                label="Warranty Duration"
                value={order ? new Date(order.warrantyDuration).toLocaleString() : null}
                disabled
                sx={disabledTextFieldStyle}
            />*/}
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
    )
}

export default CreateTicketForm;