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

const getAllOrders = async () => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.get(`/orders`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getOrdersByCustomerId = async (customerId) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.get(`/orders/${customerId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getOrderByOrderId = async (orderId) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.get(`/order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const createOrder = async (order) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.post(`/orders/`, order, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


const OrdersAPI = {
    getAllOrders,
    getOrdersByCustomerId,
    getOrderByOrderId,
    createOrder,
};

export default OrdersAPI;