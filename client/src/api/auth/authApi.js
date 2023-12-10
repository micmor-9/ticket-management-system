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
    const response = await api.post("/createExpert", signupRequest, {
        headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const resetPassword = async (email) => {
  try {
    const response = await api.post("/resetPassword", null, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (email, oldPassword, newPassword) => {
  try {
    const response = await api.post(
        `/changePassword`,
        {
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};



const authApi = {
  login,
  signup,
  createExpert,
  changePassword,
  resetPassword
}
export default authApi;
