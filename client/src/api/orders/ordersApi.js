import axios from "axios";
import backendUrl from "../../config";

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
    try {
        const response = await api.get(`/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getOrdersByCustomerId = async (customerId) => {
  try { 
    const response = await api.get(`/orders/${customerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getOrderByOrderId = async (orderId) => {
  try {
    const response = await api.get(`/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const createOrder = async (order) => {
  try {
    const response = await api.post(`/orders/`, order, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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