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

const getTickets = async () => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.get("/tickets", {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getTicketsByExpert = async (expertId) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.get(`/tickets/expert/${expertId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getTicketsByCustomer = async (customerId) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.get(`/tickets/customer/${customerId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getTicketById = async (ticketId) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.get(`/tickets/${ticketId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const createTicket = async (ticketData) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.post("/tickets/", ticketData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const updateTicket = async (ticketId, ticketData) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.put(`/tickets/${ticketId}`, ticketData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const updateTicketStatus = async (ticketId, status) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.patch(`/tickets/${ticketId}/status/${status}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const updateTicketPriority = async (ticketId, priority) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.patch(
            `/tickets/${ticketId}/priority/${priority}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const updateTicketExpert = async (ticketId, expertId) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.patch(
            `/tickets/${ticketId}/expert/${expertId}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

const getTicketStatusByTicketId = async (ticketId) => {
    const authToken = JSON.parse(atob(Cookies.get('token'))).access_token;
    if (isTokenExpired(authToken)) {
        console.log("Token expired, refreshing...");
        refreshToken();
    }
    try {
        const response = await api.get(`/status/${ticketId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
            },
        });
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
    updateTicketExpert,
};

export default TicketsAPI;
