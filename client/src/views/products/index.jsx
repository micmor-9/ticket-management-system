import { tokens } from "../../theme";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import ProductsAPI from "../../api/products/productsApi";
import { AuthContext } from "../../utils/AuthContext";

const Products = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentUser] = useContext(AuthContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let productsData = await ProductsAPI.getAllProducts();
                setProducts(productsData);
            } catch (error) {
                // Gestisci gli errori, ad esempio mostrando un messaggio di errore
            }
        }
        fetchProducts();
    }, [currentUser.role, currentUser.id]);

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "name", headerName: "Name", flex: 1},
    ];

    return (
      <Box m="20px">
        <Header title="Products" subtitle="Products catalog" />
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
            rows={products}
            columns={columns}
            getRowId={(row) => row.id}
            slots={{
              toolbar: GridToolbar,
            }}
            loading={!products.length}
            sx={{
              height: "according to the number of rows",
            }}
          />
        </Box>
      </Box>
    );

}


export default Products;