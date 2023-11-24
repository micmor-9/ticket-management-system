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

const getExpert = async (expertEmail) => {
    try {
        const response = await api.get(`/experts/id/${expertEmail}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getAllExperts = async () => {
    try {
        const response = await api.get(`/experts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }); 
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getCustomer = async (customerEmail) => {
    try {
        const response = await api.get(`/customers/id/${customerEmail}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
const getAllCustomers = async () => {
    try {
        const response = await api.get(`/customers`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getManager = async (managerEmail) => {
    try {
        const response = await api.get(`/managers/${managerEmail}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
const getAllManagers = async () => {
    try {
        const response = await api.get(`/managers/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


const getUsernameByEmail = async (email) => {
    try {
        const response = await api.get(`/users/${email}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const createUser = async (userData) => {
  try {
    const response = await api.post("/customers/", userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateUser = async (email, userData) => {
    try {
        const response = await api.put(`/customers/{email}`, userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const ProfilesAPI = {
    getExpert,
    getManager,
    getCustomer,
    getAllCustomers,
    getAllManagers,
    getAllExperts,
    getUsernameByEmail,
    createUser,
    updateUser
};

export default ProfilesAPI;
