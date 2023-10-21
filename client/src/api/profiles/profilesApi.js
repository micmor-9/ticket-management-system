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

const getExpertId = async (expertEmail) => {
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

const getCustomerId = async (customerEmail) => {
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

const getManagerId = async (managerEmail) => {
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

const createUser = async (userData) => {
  try {
    const response = await api.post("/customers", userData,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};



const ProfilesAPI = {
  getExpertId,
  getManagerId,
  getCustomerId,
  getAllCustomers,
  getAllManagers,
  getAllExperts,
  createUser,
};

export default ProfilesAPI;
