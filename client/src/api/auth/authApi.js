import axios from "axios";
import backendUrl from "../../config";
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: `${backendUrl}`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const login = async (loginRequest) => {
    try {
        const response = await api.post("/login", loginRequest);
        if (response.data) {
            let cookie = {
                'access_token': response.data.access_token,
                'refresh_token': response.data.refresh_token,
                'expires_in': response.data.expires_in,
                'refresh_expires_in': response.data.refresh_expires_in
            }
            //Save base-64 encoded structure to cookies
            Cookies.set('token', btoa(JSON.stringify(cookie)), {expires: 7, secure: true});
        } else {
            console.log("No token found");
        }
        return response.data;
    } catch (error) {
        console.log("Error during login:", error);
        throw error;
    }
};

export const refreshTokenApi = async (refreshTokenRequest) => {
    try {
        const response = await api.post("/refresh-token", refreshTokenRequest);
        if (response.data) {
            let cookie = {
                'access_token': response.data.access_token,
                'refresh_token': response.data.refresh_token,
                'expires_in': response.data.expires_in,
                'refresh_expires_in': response.data.refresh_expires_in
            }
            //Save base-64 encoded structure to cookies
            Cookies.remove('token');
            Cookies.set('token', btoa(JSON.stringify(cookie)), {expires: 7, secure: true});
        } else {
            console.log("No token found");
        }
        return response.data;
    } catch (error) {
        console.log("Error during token refresh:", error);
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
                Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
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
            params: {email},
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
                    Authorization: `Bearer ${JSON.parse(atob(Cookies.get('token'))).access_token}`,
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
