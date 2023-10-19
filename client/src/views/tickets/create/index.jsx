import { Box, Button, Container, Input, TextField, colors } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../../theme';
import OrdersAPI from '../../../api/orders/ordersApi';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../utils/AuthContext';
import styled from '@emotion/styled';
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import TicketsAPI from '../../../api/tickets/ticketsApi';

const CreateTicket = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { orderId } = useParams();
  const [order, setOrder] = useState("");
  const navigate = useNavigate();
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await OrdersAPI.getOrderByOrderId(orderId);
        setOrder(orderData);
      } catch (error) {}
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

  return (
    <Box m="20px">
      <Header title="NEW TICKET" subtitle="Open a new Ticket" />
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            margin: "20px auto",
            width: "80%",
          }}
          component="form"
          onSubmit={handleSubmit} 
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <TextField
              id="disabled-input"
              label="Order ID"
              value={order.id}
              disabled
              focused
              size="small"
            />
            <TextField
              label="Product"
              value={order.product.name}
              disabled
              focused
              size="small"
            />
            <TextField
              label="Customer"
              value={order.customer.name + " " + order.customer.surname}
              disabled
              focused
              size="small"
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <TextField
              label="Date"
              value={new Date(order.date).toLocaleString()}
              disabled
              focused
              size="small"
            />
            <TextField
              label="Warranty Duration"
              value={new Date(order.warrantyDuration).toLocaleString()}
              disabled
              size="small"
            />
          </Box>
          <TextField
            id="description"
            multiline
            label="Insert description"
            fullWidth
            required
            sx={{
              "& .Mui-required": {
                color: colors.greenAccent[300],
              },
            }}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DeleteIcon />}
            >
              {/* vedere se si vuole lascia o eliminare questo Button, magari per svuotare direttamente quello
              che si è scritto nel form */}
              Delete
            </Button>
            <Button
              variant="contained"
              color="warning"
              endIcon={<SendIcon />}
              type="submit"
            >
              Open Ticket
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CreateTicket;
