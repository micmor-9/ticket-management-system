import { Box, Button, Tooltip, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import ProductsAPI from "../../api/products/productsApi";
import { AuthContext } from "../../utils/AuthContext";
import { dataGridStyles } from "../../styles/dataGridStyles";
import { tokens } from "../../theme";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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

  const handleBuyNow = (event, row) => {
    console.log("Buy now");
    const productToBuy = {
      id: null,
      customerId: currentUser.id,
      productId: row.id,
      quantity: 1,
      date: new Date(),
      warrantyDuration: new Date(),
    }


    /*
    val id: Long?,
    val customerId: String,
    val productId: String,
    val quantity: Int?,
    val date: Date,
    val warrantyDuration: Date
    */
  }

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "warrantyDuration", headerName: "Warranty Duration", type:"date", flex: 1, valueGetter: ({value}) => value && new Date(value)},
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      type: "button",
      renderCell: ({ row }) => {
        return (
          <Tooltip title="Buy now">
            <AddShoppingCartIcon
              fontSize="small"
              sx={{
                color: colors.greenAccent[400],
                "&:hover": { color: colors.greenAccent[600] },
              }}
              onClick={(event) => handleBuyNow(event, row)}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="PRODUCTS" subtitle="Products catalog" />
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
