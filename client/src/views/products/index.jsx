import {
  Box,
  Button,
  Grid,
  MenuItem,
  Modal,
  Select,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/Delete";

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [products, setProducts] = useState([]);
  const [currentUser] = useContext(AuthContext);
  const { showDialog } = useDialog();
  const [selectQty, setSelectQty] = useState(false);
  const [productId, setProductId] = useState(null);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);

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
    event.preventDefault();
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
      productId: productId,
      quantity: quantity,
      date: new Date(),
      warrantyDuration: warrantyDuration,
    };

    OrdersAPI.createOrder(productToOrder)
      .then((response) => {
        showDialog("Order created successfully", "success");
      })
      .catch((error) => {
        showDialog("Error while creating order", "error");
      });
  };

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => {
    setOpen(false);
    setSelectQty(false);
  };
  const [quantity, setQuantity] = useState(1);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: colors.greenAccent[800],
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: "20px",
    p: 3,
  };
  const quantityValue = [...Array(maxQuantity).keys()].map((num) => num + 1);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Category", flex: 1 },
    { field: "description", headerName: "Product", flex: 1 },
    { field: "price", headerName: "Price ($)", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "warrantyDuration", headerName: "Warranty Duration", flex: 1 },
  ];

  if (currentUser.role === "Client") {
    columns.push({
      field: "action",
      headerName: "Action",
      flex: 1,
      type: "button",
      renderCell: ({ row }) => {
        return (
          <>
            {selectQty === true ? (
              <Modal open={open} onClose={handleModalClose}>
                <Stack sx={style} spacing={2}>
                  <Typography variant="h2">New Order</Typography>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={8}>
                      <Typography variant="h5">Order info: </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h5">{productName}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="h5">Select quantity: </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        size="small"
                      >
                        {quantityValue.map((value) => (
                          <MenuItem value={value} key={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="h5">Sub Total: </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h5">
                        {productPrice * quantity}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    spacing={2}
                    xs={11}
                  >
                    <Grid item>
                      <Button
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        size="small"
                        onClick={() => {
                          handleModalClose();
                          setQuantity(1);
                        }}
                        sx={{
                          backgroundColor: colors.redAccent[600],
                          "&:hover": {
                            backgroundColor: colors.redAccent[500],
                          },
                        }}
                      >
                        CANCEL
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        size="small"
                        sx={{
                          backgroundColor: colors.greenAccent[600],
                          "&:hover": {
                            backgroundColor: colors.greenAccent[400],
                          },
                        }}
                        onClick={(event) => {
                          handleBuyNow(event, row);
                          handleModalClose();
                          setQuantity(1);
                        }}
                      >
                        ORDER NOW
                      </Button>
                    </Grid>
                  </Grid>
                </Stack>

                {/* <Stack sx={style} direction="column" spacing={3}>
                  <Typography
                    variant="h2"
                    sx={{
                      mb: "20px",
                    }}
                  >
                    NEW ORDER
                  </Typography>
                  <Typography variant="h5">
                    Order info: {productName}
                  </Typography>
                  <Stack direction="row" alignItems="baseline" spacing={10}>
                    <Typography id="modal-modal-title" variant="h5">
                      Select quantity
                    </Typography>
                    <Select
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      size="small"
                    >
                      {quantityValue.map((value) => (
                        <MenuItem value={value} key={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  <Stack direction="row">
                    <Typography variant="h5">Sub Total:</Typography>
                    <Typography variant="h5">
                      {row.price * quantity} 
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    justifyContent="flex-end"
                    mt={4}
                  >
                    <Button
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      size="small"
                      onClick={() => {
                        handleModalClose();
                        setQuantity(1);
                      }}
                      sx={{
                        backgroundColor: colors.redAccent[600],
                        "&:hover": {
                          backgroundColor: colors.redAccent[500],
                        },
                      }}
                    >
                      CANCEL
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<AddShoppingCartIcon />}
                      size="small"
                      sx={{
                        backgroundColor: colors.greenAccent[600],
                        "&:hover": {
                          backgroundColor: colors.greenAccent[400],
                        },
                      }}
                      onClick={(event) => {
                        handleBuyNow(event, row);
                        handleModalClose();
                        setQuantity(1);
                      }}
                    >
                      ORDER NOW
                    </Button>
                  </Stack>
                </Stack> */}
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
                    handleModalOpen();
                    setProductId(row.id);
                    setMaxQuantity(row.quantity);
                    setProductName(row.description);
                    setProductPrice(row.price);
                  }}
                />
              </Tooltip>
            )}
          </>
        );
      },
    });
  }

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
