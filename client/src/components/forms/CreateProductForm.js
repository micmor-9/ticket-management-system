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
        id: 0,
        name : "",
        description: "",
        price: 0.0,
        quantity: 0
    });
    const handleFormSubmit = async () => {
        console.log(product);
        /*const productData = {
            id: product.id,
            name: product.name,
            description:  product.description ,
            price: parseFloat(product.price) ,
            quantity: parseInt(product.quantity),
        };*/
        const productData = {
            id: "13",
            name: "Mac",
            description: "MacBook Pro",
            price: 0.0 ,
            quantity: 10,
            warrantyDuration: "",
        };
        console.log(productData);
        try {
            const response = await productsApi.createProducts(productData);
            console.log(response);
            navigate(-1);
        } catch (error) {
            console.error("An error occurred:", error);
            if (error.response) {
                console.log("Server response:", error.response.data);
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
                label="Id"
                value={product.id}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("id", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Name"
                value={product.name}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("name", e.target.value)}
            />
            <TextField
                fullWidth
                type="text"
                label="Description"
                value={product.description}
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("description", e.target.value)}
            />
            <TextField
                fullWidth
                type="number"
                label="Price"
                value={product.price}
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
                sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                onChange={(e) => handleFieldChange("quantity", e.target.value)}
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