import axios from "axios";
import backendUrl from "../../config";
import Cookies from "js-cookie";
import {isTokenExpired, refreshToken} from "../init";

const api = axios.create({
    baseURL: `${backendUrl}`,
    headers: {
        "Content-Type": "application/json",
    },
});

const handleApiError = (error) => {
    console.log("Error during API call:", error);
    throw error;
};

const getAllProducts = async () => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.get(`/products/`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
const createProducts = async (productData) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.post("/products", productData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const updateProducts = async (id, productData) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.put(`/products/${id}`, productData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
const ProductsAPI = {
    getAllProducts, createProducts, updateProducts
};

export default ProductsAPI;