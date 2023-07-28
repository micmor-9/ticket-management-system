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

export const getTickets = async () => {
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

export const getTicketById = async (ticketId) => {
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

export const createTicket = async (ticketData) => {
  try {
    const response = await api.post("/tickets/", ticketData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateTicket = async (ticketId, ticketData) => {
  try {
    const response = await api.put(`/tickets/${ticketId}`, ticketData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateTicketStatus = async (ticketId, status) => {
  try {
    const response = await api.patch(`/tickets/${ticketId}/status/${status}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateTicketPriority = async (ticketId, priority) => {
  try {
    const response = await api.patch(
      `/tickets/${ticketId}/priority/${priority}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
