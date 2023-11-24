import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import CreateProductForm from "../../components/forms/CreateProductForm";
import { dataGridStyles } from "../../styles/dataGridStyles";

const CreateProduct = () => {
    const theme = useTheme();

    return (
        <Box m="20px">
            <Header title="CREATE PRODUCT" subtitle="Create a New Product"/>
            <Box m="40px 0 0 0" height="70h" sx={dataGridStyles(theme)}>
                <CreateProductForm/>
            </Box>
        </Box>
    );
};

export default CreateProduct;
