import {useTheme} from "@emotion/react";
import {useContext} from "react";
import {AuthContext} from "../../utils/AuthContext";
import OrdersAPI from "../../api/orders/ordersApi";
import {useState, useEffect} from "react";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Header from "../../components/Header";
import {Box} from "@mui/system";
import {useNavigate} from "react-router-dom";
import {Button, Typography} from "@mui/material";
import {tokens} from "../../theme";
import {dataGridStyles} from "../../styles/dataGridStyles";

const Orders = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

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
                console.log(error);
            }
        };
        fetchOrders();
    }, [currentUser.id, currentUser.role, currentUser.email]);

    const handleButtonClick = (params) => {
        navigate(`/tickets/new/${params}`);
    };

    const columns = [
        {field: "id", headerName: "ID"},
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            type: "date",
            valueGetter: ({value}) => value && new Date(value),
        },
        {
            field: "warrantyDuration",
            headerName: "Warranty Duration",
            flex: 1,
            type: "date",
            valueGetter: ({value}) => value && new Date(value),
        },
        {
            field: "customer",
            headerName: "Customer",
            flex: 1,
            type: "string",
            valueGetter: ({value}) => value && value.name + " " + value.surname,
        },
        {
            field: "product",
            headerName: "Product",
            flex: 1,
            valueGetter: ({value}) => value && value.name,
        },
        {
            field: "button",
            headerName: "Ticket",
            flex: 1,
            type: "button",
            renderCell: ({row}) => {
                return (
                    <Button
                        id="create-ticket"
                        sx={{
                            backgroundColor: colors.redAccent[600],
                            "&:hover": {
                                backgroundColor: colors.redAccent[500],
                            },
                        }}
                        onClick={() => handleButtonClick(row.id)}
                    >
                        <Typography color="white">Create Ticket</Typography>
                    </Button>
                );
            },
        },
    ];


    return (
        <Box m="20px">
            <Header title="ORDERS" subtitle="Orders history"/>
            <Box m="40px 0 0 0" height="70vh" sx={dataGridStyles(theme)}>
                {/* <Box
          sx={{
            justifyContent: "center",
          }}
        >
          <DataGrid
            rows={orders}
            columns={columns}
            loading={!orders.length}

            getRowId={(row) => row.id}
            slots={{
              toolbar: GridToolbar,
            }}
            sx={{
              height: "50vh",
            }}
            // onCellClick={handleCellClick}
          />
        </Box> */}
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
                    // onCellClick={handleCellClick}
                />
            </Box>
        </Box>
    );
};


export default Orders;
