import {Box, Button, TextField,} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@emotion/react";
import {tokens} from "../../theme";
import {useAuth} from "../../utils/AuthContext";
import {useDialog} from "../../utils/DialogContext";
import productsApi from "../../api/products/productsApi";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";

const CreateProductForm = ({isUpdateMode, initialProductData}) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useAuth();
    const {showDialog} = useDialog();
    const filter = createFilterOptions();
    const [product, setProduct] = useState(initialProductData || {
        id: "",
        description: "",
        name: "",
        price: "",
        quantity: "",
        warrantyDuration: ""
    });
    const [errors, setErrors] = useState({
        id: "",
        description: "",
        name: "",
        price: "",
        quantity: "",
        warrantyDuration: ""
    });
    const [category, setCategory] = useState(initialProductData ? initialProductData.description : "");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await productsApi.getAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };
        fetchCategories();
    }, []);

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
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const productData = {
                id: product.id,
                name: product.name,
                description: product.description ? product.description : "",
                price: product.price ? parseFloat(product.price) : 0,
                quantity: product.quantity ? parseInt(product.quantity) : 0,
                warrantyDuration: product.warrantyDuration ? product.warrantyDuration : 0
            };

            try {
                if (isUpdateMode) {
                    await productsApi.updateProducts(product.id, productData);
                    showDialog("Product updated", "success");
                    navigate(-1);
                } else {
                    await productsApi.createProducts(productData);
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
        currentUser.role === "Manager" && (
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
                <Autocomplete
                    value={category}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            setCategory({
                                title: newValue,
                            });
                            handleFieldChange("description", newValue)
                        } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            setCategory({
                                title: newValue.inputValue,
                            });
                            handleFieldChange("description", newValue.inputValue)
                        } else {
                            setCategory(newValue);
                            handleFieldChange("description", newValue)
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        const {inputValue} = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some((option) => inputValue === option.title);
                        if (inputValue !== '' && !isExisting) {
                            filtered.push({
                                inputValue,
                                title: `Add "${inputValue}"`,
                            });
                        }
                        return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="description"
                    options={categories && categories.map((cat) => {
                        return {
                            title: cat,
                            inputValue: cat,
                        };
                    })}
                    getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === 'string') {
                            return option;
                        }
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        // Regular option
                        return option.title ? option.title : "";
                    }}
                    renderOption={(props, option) => <li {...props}>{option.title}</li>}
                    sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                    freeSolo
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            required
                            error={Boolean(errors.description)}
                            helperText={errors.description}
                            label="Category"
                        />
                    )}
                />
                <TextField
                    fullWidth
                    type="text"
                    label="Price"
                    value={product.price}
                    error={Boolean(errors.price)}
                    helperText={errors.price}
                    sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                    inputProps={{
                        pattern: "^[0-9]*[.,]?[0-9]*$",
                        inputMode: "numeric",
                    }}
                    onChange={(e) => {
                        const value = e.target.value.replace(/,/, '.');
                        //setPriceInput(value);
                        if (/^[0-9]*[.]?[0-9]*$/.test(value)) {
                            const decimalCount = (value.split(/[.]/)[1] || '').length;

                            if (decimalCount <= 2) {
                                handleFieldChange("price", value);
                                setErrors({
                                    ...errors,
                                    price: "",
                                });
                            } else {
                                setErrors({
                                    ...errors,
                                    price: "Maximum two decimal places allowed",
                                });
                            }
                        } else {
                            setErrors({
                                ...errors,
                                price: "Invalid number format",
                            });
                        }
                    }}
                />
                <TextField
                    fullWidth
                    type="text"
                    label="Quantity"
                    value={product.quantity}
                    inputProps={{
                        pattern: "[0-9]*",
                        inputMode: "numeric",
                    }}
                    error={Boolean(errors.quantity)}
                    helperText={errors.quantity}
                    sx={{...disabledTextFieldStyle, gridColumn: "span 2"}}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value)) {
                            handleFieldChange("quantity", value);
                        }
                    }}
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
                    type="number"
                    label="Warranty Duration (months)"
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
                            {isUpdateMode ? "Save" : "Create New product"}
                        </Button>)}
                </Box>
            </Box>)
    );

}
export default CreateProductForm;