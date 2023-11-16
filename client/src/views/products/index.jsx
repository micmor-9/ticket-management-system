import { Box, Modal, Stack, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState, useContext } from "react";
import ProductsAPI from "../../api/products/productsApi";
import { AuthContext } from "../../utils/AuthContext";
import { dataGridStyles } from "../../styles/dataGridStyles";
import { tokens } from "../../theme";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import OrdersAPI from "../../api/orders/ordersApi";
import { useDialog } from "../../utils/DialogContext";
import CheckIcon from "@mui/icons-material/Check";

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [products, setProducts] = useState([]);
  const [currentUser] = useContext(AuthContext);
  const { showDialog } = useDialog();
  const [selectQty, setSelectQty] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let productsData = await ProductsAPI.getAllProducts();
        setProducts(productsData);
      } catch (error) {
        showDialog("Error while fetching products", "error");
      }
    };
    fetchProducts();
  }, [currentUser.role, currentUser.id]);

  const handleBuyNow = (event, row) => {
    // event.preventDefault();
    const warranty = row.warrantyDuration.split(" ");
    let warrantyDuration = new Date();
    if (warranty[1] === "years") {
      warrantyDuration.setFullYear(
        warrantyDuration.getFullYear() + parseInt(warranty[0])
      );
    } else if (warranty[1] === "months") {
      warrantyDuration.setMonth(
        warrantyDuration.getMonth() + parseInt(warranty[0])
      );
    }
    const productToOrder = {
      id: null,
      customerId: currentUser.email,
      productId: row.id,
      quantity: 1,
      date: new Date(),
      warrantyDuration: warrantyDuration,
    };

    console.log(productToOrder);

    OrdersAPI.createOrder(productToOrder)
      .then((response) => {
        showDialog("Order created successfully", "success");
      })
      .catch((error) => {
        showDialog("Error while creating order", "error");
      });
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectQty(false);
  };
  const [quantity, setQuantity] = useState(1);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: colors.greenAccent[800],
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: "20px",
    p: 4,
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "warrantyDuration", headerName: "Warranty Duration", flex: 1},
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      type: "button",
      renderCell: ({ row }) => {
        return (
          <>
            {selectQty === true ? (
              <Modal open={open} onClose={handleClose}>
                <Stack
                  sx={style}
                  justifyItems="center"
                  direction="row"
                  flexWrap="initial"
                  useFlexGap
                  spacing={2}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h4"
                    component="h2"
                    sx={{ marginBottom: "20px" }}
                  >
                    Select the quantity
                  </Typography>
                  <TextField
                    label="Quantity"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      defaultValue: quantity,
                      min: 1,
                      max: parseInt(row.quantity),
                    }}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                  <CheckIcon fontSize="large" />
                </Stack>
              </Modal>
            ) : (
              <Tooltip title="Buy now">
                <AddShoppingCartIcon
                  fontSize="small"
                  sx={{
                    color: colors.greenAccent[400],
                    "&:hover": { color: colors.greenAccent[600] },
                  }}
                  onClick={() => {
                    setSelectQty(true);
                    handleOpen();
                    console.log(row.quantity);
                  }}
                />
              </Tooltip>
            )}
          </>
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
