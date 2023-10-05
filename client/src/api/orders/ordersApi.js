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

const OrdersAPI = {
  getAllOrders,
  getOrdersByCustomerId,
};

export default OrdersAPI;