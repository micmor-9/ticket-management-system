import {createContext, useState, useEffect} from "react";
import jwtDecode from "jwt-decode";
import ProfilesAPI from "../api/profiles/profilesApi";
import Cookies from "js-cookie";
import {refreshTokenApi} from "../api/auth/authApi";

export const AuthContext = createContext();

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState({});

    const isTokenExpired = (token) => {
        const decodedToken = jwtDecode(token.access_token);
        return !!(decodedToken.exp && decodedToken.exp * 1000 < Date.now());
    };

    const logout = () => {
        Cookies.remove('token');
        sessionStorage.removeItem("notifications");
        setCurrentUser({});
    };

    const _refreshToken = async (refreshToken) => {
        try {
            const response = await refreshTokenApi({
                refresh_token: refreshToken,
            });

            let cookie = {
                'access_token': response.access_token,
                'refresh_token': response.refresh_token,
                'expires_in': response.expires_in,
                'refresh_expires_in': response.refresh_expires_in
            }
            //Save base-64 encoded structure to cookies
            Cookies.remove('token');
            Cookies.set('token', btoa(JSON.stringify(cookie)), {expires: 7, secure: true});
            console.log("Token refreshed successfully!");
            await fetchToken();
        } catch (error) {
            console.error("Error during token refresh:", error);
            logout();
        }
    };

    const fetchToken = async () => {
        const token = Cookies.get('token') ? JSON.parse(atob(Cookies.get('token'))) : null;
        if (token) {
            if (!isTokenExpired(token)) {
                try {
                    const decodedToken = jwtDecode(token.access_token);

                    const role =
                        decodedToken.resource_access["springboot-keycloak-client"].roles[0];
                    let db_user = null;
                    if (role === "Manager") {
                        db_user = await ProfilesAPI.getManager(decodedToken.email);
                    }
                    if (role === "Expert") {
                        db_user = await ProfilesAPI.getExpert(decodedToken.email);
                    }
                    if (role === "Client") {
                        db_user = await ProfilesAPI.getCustomer(decodedToken.email);
                    }

                    setCurrentUser({
                        email: decodedToken.email,
                        name: db_user?.name,
                        surname: db_user?.surname,
                        username: decodedToken.preferred_username,
                        role: decodedToken.resource_access["springboot-keycloak-client"]
                            .roles[0],
                        id: db_user?.id,
                        address1: db_user?.address1,
                        address2: db_user?.address2,
                        contact: db_user?.contact,
                        profile: db_user
                    });
                } catch (error) {
                    console.log("Error during token fetch:", error);
                    logout();
                }
            } else {
                await _refreshToken(token.refresh_token)
            }
        }
    };

    useEffect(() => {
        fetchToken();
    }, []);

    return [currentUser, logout];
};
