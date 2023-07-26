import axios from "axios";
import backendUrl from "../../config";

const api = axios.create({
  baseURL: `${backendUrl}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (loginRequest) => {
  try {
    const response = await api.post("/login", loginRequest);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data));
    } else {
      console.log("No token found");
    }
    return response.data;
  } catch (error) {
    console.log("Error during login:", error);
    throw error;
  }
};

export const signup = async (signupRequest) => {
  try {
    const response = await api.post("/signup", signupRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createExpert = async (signupRequest) => {
  try {
    const response = await api.post("/createExpert", signupRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};
