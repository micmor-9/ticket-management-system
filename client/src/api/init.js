import jwtDecode from "jwt-decode";
import {refreshTokenApi} from "./auth/authApi";
import Cookies from "js-cookie";

export const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    return !!(decodedToken.exp && decodedToken.exp * 1000 < Date.now());
}

export const refreshToken = async () => {
    const token = Cookies.get('token') ? JSON.parse(atob(Cookies.get('token'))) : null;
    try {
        const response = await refreshTokenApi({
            refresh_token: token.refresh_token,
        })

        if (response) {
            console.log("In callback")
            let cookie = {
                'access_token': response.access_token,
                'refresh_token': response.refresh_token,
                'expires_in': response.expires_in,
                'refresh_expires_in': response.refresh_expires_in
            }
            //Cookies.remove('token');
            Cookies.set('token', btoa(JSON.stringify(cookie)), {expires: 7, secure: true});
            console.log("Token refreshed successfully!");
        }
    } catch (error) {
        console.error("Error during token refresh:", error);
        //Cookies.remove('token');
    }
}