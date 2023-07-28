import axios from "axios";
import backendUrl from "../../config";

const api = axios.create({
  baseURL: `${backendUrl}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getMessagesByTicket = async (ticketId) => {
  try {
    const response = await api.get(`/messages/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching messages");
  }
};

export const postMessage = async (message) => {
  try {
    const response = await api.post("/messages", message);
    return response.data;
  } catch (error) {
    throw new Error("Error sending message");
  }
};
