import {useTheme} from "@emotion/react";
import React, {useContext} from "react";
import {AuthContext} from "../../utils/AuthContext";
import OrdersAPI from "../../api/orders/ordersApi";
import {useState, useEffect} from "react";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Header from "../../components/Header";
import {Box} from "@mui/system";
import {useNavigate} from "react-router-dom";
import { Button, Typography} from "@mui/material";
import {tokens} from "../../theme";
import {dataGridStyles} from "../../styles/dataGridStyles";
import {useDialog} from "../../utils/DialogContext";
import {SentimentDissatisfiedOutlined} from "@mui/icons-material";

const Orders = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
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
        fetchOrders();
    }, [currentUser.id, currentUser.role, currentUser.email, showDialog]);

    const columns = [
      { field: "id", headerName: "ID" },
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        type: "date",
        valueGetter: ({ value }) => value && new Date(value),
      },
      {
        field: "warrantyDuration",
        headerName: "Warranty Duration",
        flex: 1,
        type: "date",
        valueGetter: ({ value }) => value && new Date(value),
      },
      {
        field: "customer",
        headerName: "Customer",
        flex: 1,
        type: "string",
        valueGetter: ({ value }) => value && value.name + " " + value.surname,
      },
      {
        field: "product",
        headerName: "Product",
        flex: 1,
        valueGetter: ({ value }) => value && value.description,
      },
      {
        field: "quantity",
        headerName: "Quantity",
        flex: 1,
      },
      {
        field: "button",
        headerName: "Ticket",
        flex: 1,
        type: "button",
        renderCell: ({ row }) => {
          return (
            <Button
              id="create-ticket"
              sx={{
                "&:hover": {
                  backgroundColor: colors.redAccent[400],
                  color: "white",
                },
                borderRadius: "15px",
                borderColor: colors.redAccent[400],
                color: colors.redAccent[400],
              }}
              variant="outlined"
              onClick={() => navigate(`/tickets/create/${row.id}`)}
            >
              <Typography fontSize="12px">Create Ticket</Typography>
            </Button>
          );
        },
      },
    ];


    return (
        <Box m="20px">
            <Header title="ORDERS" subtitle="Orders history"/>
            {orders.length === 0 ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="400px"
                >
                    <SentimentDissatisfiedOutlined style={{ fontSize: 80, color: '#ff4081' }} />
                    <Typography variant="h3" color="textSecondary">
                        No orders found
                    </Typography>
                    <Box mt={3}>
                        <Typography variant="body" color="textSecondary">
                            Looks like there are no orders available.
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            If you purchase a product, you will see your order here.
                        </Typography>

                    </Box>
                </Box>
            ) : (
            <Box m="40px 0 0 0" height="70vh" sx={dataGridStyles(theme)}>
                <DataGrid
                    rows={orders}
                    columns={columns}
                    loading={!orders.length}
                    getRowId={(row) => row.id}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    sx={{
                        height: "70vh",
                    }}
                />
            </Box>
                )}
        </Box>
    );
};


export default Orders;
