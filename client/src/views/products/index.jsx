import {Box, Button, useTheme} from "@mui/material";
import Header from "../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import ProductsAPI from "../../api/products/productsApi";
import { AuthContext } from "../../utils/AuthContext";
import { dataGridStyles } from "../../styles/dataGridStyles";
import AddIcon from "@mui/icons-material/Add";
import HeaderActions from "../../components/HeaderActions";

const Products = () => {
  const theme = useTheme();

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
    };
    fetchProducts();
  }, [currentUser.role, currentUser.id]);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="PRODUCTS" subtitle="Products catalog" >
        {currentUser.role === "Manager" && (
        <HeaderActions>
          <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon/>}
              onClick={() => {
                navigate(`/products/create`)
              }}
              sx={{marginLeft: "15px"}}
          >New Product
          </Button>
        </HeaderActions>)}
      </Header>
      <Box m="40px 0 0 0" sx={dataGridStyles(theme)}>
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{
            toolbar: GridToolbar,
          }}
          loading={!products.length}
          sx={{
            height: "70vh",
          }}
        />
      </Box>
    </Box>
  );
};

export default Products;
