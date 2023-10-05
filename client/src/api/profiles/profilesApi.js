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

<<<<<<< HEAD
const getCustomer = async (customerEmail) => {
=======
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
>>>>>>> dev
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

<<<<<<< HEAD
const getManager = async (managerEmail) => {
=======
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
>>>>>>> dev
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

<<<<<<< HEAD
const getUsernameByEmail = async (email) => {
  try {
    const response = await api.get(`/users/${email}`, {
=======
const getAllManagers = async () => {
  try {
    const response = await api.get(`/managers/`, {
>>>>>>> dev
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

<<<<<<< HEAD
const ProfilesAPI = {
  getExpert,
  getManager,
  getCustomer,
  getUsernameByEmail,
=======



const ProfilesAPI = {
  getExpertId,
  getManagerId,
  getCustomerId,
  getAllCustomers,
  getAllManagers,
  getAllExperts,
>>>>>>> dev
};

export default ProfilesAPI;
