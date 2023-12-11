import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import CreateProductForm from "../../components/forms/CreateProductForm";
import { dataGridStyles } from "../../styles/dataGridStyles";
import {useLocation} from "react-router-dom";

const CreateProduct = () => {
    const theme = useTheme();
    const location = useLocation();
    const {state} = location;
    const isUpdateMode = state?.isUpdateMode || false;
    const initialProductData = state?.productData || null;
    return (
        <Box m="20px">
            <Header title= {isUpdateMode? "UPDATE PRODUCT" : "CREATE PRODUCT"} subtitle={isUpdateMode? "Update the product" : "Create a New Product"}/>
            <Box m="40px 0 0 0" height="70h" sx={dataGridStyles(theme)}>
                <CreateProductForm isUpdateMode={isUpdateMode} initialProductData={initialProductData}/>
            </Box>
        </Box>
    );
};

export default CreateProduct;
