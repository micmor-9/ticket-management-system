import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useContext } from "react";
import { AuthContext } from "../../utils/AuthContext";
import OrdersAPI from "../../api/orders/ordersApi";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { Box } from "@mui/system";
import { mockOrders } from "../../data/mockOrders";
import { useNavigate } from "react-router-dom";

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
        ordersData = await OrdersAPI.getAllOrders();
        setOrders(ordersData);
      } catch (error) {
        // Gestisci gli errori, ad esempio mostrando un messaggio di errore
      }
    };
    fetchOrders();
  }, [currentUser.id, currentUser.role]);

  const columns = [
    { field: "id", headerName: "ID" },
    { 
        field: "date", 
        headerName: "Date", 
        flex: 1,
        type: "dateTime",
        valueGetter: ({ value }) => value && new Date(value),
        cellClassName: "date-column--cell", 
    },
    { 
        field: "warrantyDuration", 
        headerName: "Warranty Duration",
        flex: 1, 
        type: "dateTime",
        valueGetter: ({ value }) => value && new Date(value),
        cellClassName: "warrantyDuration-column--cell",
    },
    { 
        field: "customer", 
        headerName: "Customer", 
        flex: 1,
        cellClassName: "customerID-column--cell",
        valueGetter: ({ value }) => value && value.name + " " + value.surname,
    },
    { 
        field: "product", 
        headerName: "Product", 
        flex: 1,
        cellClassName: "productID-column--cell",
        valueGetter: ({ value }) => value && value.name,
    },
  ];

  return (
    <Box m="20px">
      <Header title="ORDERS" subtitle="Orders history" />
      <Box
        m="40px 0 0 0"
        height="70h"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiCircularProgress-root": {
            color: colors.greenAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: colors.grey[100],
          },
          "& .MuiDataGrid-panelWrapper .MuiButton-root": {
            color: colors.greenAccent[400] + " !important",
          },
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
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
            height: "according to the number of rows",
          }}
        />
      </Box>
    </Box>
  );
};

export default Orders;
