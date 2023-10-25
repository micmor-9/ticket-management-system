import axios from "axios";
import backendUrl from "../../config";

const api = axios.create({
  baseURL: `${backendUrl}`,
  headers: {
    "Content-Type": "application/json",
  },
});
const ticketStatusApi = axios.create({
  baseURL: `${backendUrl}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
const handleApiError = (error) => {
  console.log("Error during API call:", error);
  throw error;
};

const getTickets = async () => {
  try {
    const response = await api.get("/tickets", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getTicketsByExpert = async (expertId) => {
  try {
    const response = await api.get(`/tickets/expert/${expertId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getTicketsByCustomer = async (customerId) => {
  try {
    const response = await api.get(`/tickets/customer/${customerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const createTicket = async (ticketData) => {
  try {
    const response = await api.post("/tickets/", ticketData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateTicket = async (ticketId, ticketData) => {
  try {
    const response = await api.put(`/tickets/${ticketId}`, ticketData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateTicketStatus = async (ticketId, status) => {
  try {
    const response = await api.patch(`/tickets/${ticketId}/status/${status}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateTicketPriority = async (ticketId, priority) => {
  try {
    const response = await api.patch(
      `/tickets/${ticketId}/priority/${priority}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getTicketStatusByTicketId = async (ticketId) => {
  try {
    const response = await ticketStatusApi.get(`/status/${ticketId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const TicketsAPI = {
  getTickets,
  getTicketsByExpert,
  getTicketsByCustomer,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  updateTicketPriority,
  getTicketStatusByTicketId,
};

export default TicketsAPI;
