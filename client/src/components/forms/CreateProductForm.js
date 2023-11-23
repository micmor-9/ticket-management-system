import {
    Box, Button, FormControl, InputLabel, MenuItem, Select, TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import React, {useEffect, useState} from "react";
import TicketsAPI from "../../api/tickets/ticketsApi";
import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@emotion/react";
import {tokens} from "../../theme";
import {useAuth} from "../../utils/AuthContext";
import {useDialog} from "../../utils/DialogContext";
import productsApi from "../../api/products/productsApi";

const CreateProductForm = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useAuth();
    const [product, setProduct] = useState({
        id: "",
        category : "",
        product: "",
        price: 0.0,
        quantity: 0,
        warrantyDuration: ""
    });
    const [errors, setErrors] = useState({
        id: "",
        category : "",
        product: "",
        price: "",
        quantity: "",
        warrantyDuration: ""
    });
    const validateForm = () => {

        /* Controllare se esiste l'ordine con quell'id"*/


    }
    const handleFormSubmit = async () => {
        const newErrors = {};
        const validateLength = (field, value, name, min, max) => {
            if (value.length === 0) {
                newErrors[field] = "Required";
            } else if (value.length < min) {
                newErrors[field] = `${name} is too short`;
            } else if (value.length > max) {
                newErrors[field] = `${name} is too long`;
            }
        };

        validateLength("id", product.id, "Id", 1, 50);
        validateLength("product", product.product, "Product", 2, 50);
        if (product.category.length > 0) {
            validateLength("category", product.category, "Category", 2, 50);
        }
        if (product.price.length > 0) {
            validateLength("price", product.price, "Price", 1, 10);
        }
        if (product.quantity.length > 0) {
            validateLength("quantity", product.quantity, "Quantity", 1, 10);
        }
        if (product.warrantyDuration.length > 0) {
            const warranty = product.warrantyDuration.split(" ");
            if(!isNaN(parseInt(warranty[0]))){
                if(warranty[1]!== "years" && warranty[1]!== "month"){
                    newErrors["warrantyDuration"] = "Wrong format [years/month]"

                }
            }
            else {
                newErrors["warrantyDuration"] = "Wrong format [number required]"
            }
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const productData = {
                id: product.id ,
                name: product.product,
                description:  product.category ? product.category : "",
                price: product.price ? parseFloat(product.price) : 0,
                quantity: product.quantity ? parseInt(product.quantity) : 0,
                warrantyDuration: product.warrantyDuration ? product.warrantyDuration : ""
            };

            try {
                const response = await productsApi.createProducts(productData);
                console.log(response);
                navigate(-1);
            } catch (error) {
                console.error("An error occurred:", error);
                if (error.response.data.status === 409) {
                    alert("Product creation error");
                    setErrors({...errors, id: "Product with this ID already exists!"});
                    console.log("Product with this ID already exists!");
                    // Handle the duplicate scenario on the client side
                }
            }
        }

    }
    const handleFieldChange = (fieldName, value) => {
        setProduct({...product, [fieldName]: value});
    };

    const disabledTextFieldStyle = {
        "& .Mui-disabled": {
            color:
                theme.palette.mode === "dark"
                    ? colors.greenAccent[600] + " !important"
                    : colors.greenAccent[200] + " !important",
        },
        "& .MuiInputBase-input": {
            color:
                theme.palette.mode === "dark"
                    ? colors.greenAccent[300]
                    : colors.greenAccent[200],
        },
        gridColumn: "span 4",
    };

    return (
        <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
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
        >

            <TextField
                fullWidth
                type="text"
                label="Product"
                value={product.product}
                required
                error={Boolean(errors.product)}
                helperText={errors.product}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("product", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Category"
                value={product.category}
                error={Boolean(errors.category)}
                helperText={errors.category}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("category", e.target.value)}
            />
            <TextField
                fullWidth
                type="number"
                label="Price"
                value={product.price}
                error={Boolean(errors.price)}
                helperText={errors.price}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={(e) => handleFieldChange("price", e.target.value)}
            />
            <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={product.quantity}
                InputLabelProps={{
                    shrink: true,
                }}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("quantity", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Id"
                value={product.id}
                required
                error={Boolean(errors.id)}
                helperText={errors.id}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("id", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Warranty Duration"
                value={product.warrantyDuration}
                InputLabelProps={{
                    shrink: true,
                }}
                error={Boolean(errors.warrantyDuration)}
                helperText={errors.warrantyDuration}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("warrantyDuration", e.target.value)}
            />
            <Box display="flex" justifyContent="flex-end" gridColumn="span 4">
                <Button type="button" variant="contained" startIcon={<DeleteIcon/>}
                        sx={{
                            backgroundColor: colors.redAccent[600],
                            margin: "0 20px 0 0",
                            "&:hover": {
                                backgroundColor: colors.redAccent[500],
                            },
                        }}
                        onClick={() => {
                            navigate(-1);
                        }}>
                    Cancel
                </Button>
                {currentUser.role === "Manager" && (
                    <Button type="button" startIcon={<SendIcon/>} variant="contained"
                            sx={{
                                backgroundColor: colors.greenAccent[600],
                                marginRight: "0px",
                                "&:hover": {
                                    backgroundColor: colors.greenAccent[400],
                                },
                            }}
                            onClick={handleFormSubmit}
                    >
                        Create New product
                    </Button>)}
            </Box>
        </Box>
    );

}
export default CreateProductForm;