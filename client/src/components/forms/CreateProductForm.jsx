import {
    Box, Button, FormControl, InputLabel, MenuItem, Select, TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@emotion/react";
import {tokens} from "../../theme";
import {useAuth} from "../../utils/AuthContext";
import {useDialog} from "../../utils/DialogContext";
import productsApi from "../../api/products/productsApi";

const CreateProductForm = ({isUpdateMode, initialProductData}) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useAuth();
    const {showDialog} = useDialog();
    const [product, setProduct] = useState( initialProductData ||{
        id: "",
        description : "",
        name: "",
        price: 0.0,
        quantity: 0,
        warrantyDuration: ""
    });
    const [errors, setErrors] = useState({
        id: "",
        description : "",
        name: "",
        price: "",
        quantity: "",
        warrantyDuration: ""
    });

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
        validateLength("name", product.name, "Product", 2, 50);
        if (product.description.length > 0) {
            validateLength("category", product.description, "Category", 2, 50);
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
                if(warranty[1]!== "years" && warranty[1]!== "months"){
                    newErrors["warrantyDuration"] = "Wrong format"
                }
            }
            else {
                newErrors["warrantyDuration"] = "Wrong format"
            }
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const productData = {
                id: product.id ,
                name: product.name,
                description:  product.description ? product.description : "",
                price: product.price ? parseFloat(product.price) : 0,
                quantity: product.quantity ? parseInt(product.quantity) : 0,
                warrantyDuration: product.warrantyDuration ? product.warrantyDuration : ""
            };
            console.log(product.id);
            try {
                if(isUpdateMode) {
                    const response = await productsApi.updateProducts(product.id, productData);
                    console.log(response);
                    showDialog("Product updated", "success");
                    navigate(-1);
                }
                else{
                    const response = await productsApi.createProducts(productData);
                    console.log(response);
                    showDialog("Product created", "success");
                    navigate(-1);
                }
            } catch (error) {
                console.error("An error occurred:", error);
                if (!isUpdateMode && error.response.data.status === 409) {
                    showDialog("Product creation error", "error");
                    setErrors({...errors, id: "Product with this ID already exists!"});
                    console.log("Product with this ID already exists!");
                }
                if (isUpdateMode && error.response.data.status === 404) {
                    showDialog("Product update error", "error");
                    setErrors({...errors, id: "Product with this ID doesn't exists!"});
                    console.log("Product with this ID doesn't exists!");
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
        currentUser.role==="Manager" && (
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
                value={product.name}
                required
                error={Boolean(errors.name)}
                helperText={errors.name}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("name", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Category"
                value={product.description}
                error={Boolean(errors.description)}
                helperText={errors.description}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("description", e.target.value)}
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
                disabled={isUpdateMode}
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
                        {isUpdateMode? "Save" : "Create New product"}
                    </Button>)}
            </Box>
        </Box>)
    );

}
export default CreateProductForm;