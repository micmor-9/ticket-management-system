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

const getAllUsers = async () => {
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

const ProfilesAPI = {
  getExpertId,
  getManagerId,
  getCustomerId,
  getAllUsers,
};

export default ProfilesAPI;
