import {createContext, useState, useEffect} from "react";
import jwtDecode from "jwt-decode";
import ProfilesAPI from "../api/profiles/profilesApi";

export const AuthContext = createContext();

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState({});

    const isTokenExpired = (token) => {
        const decodedToken = jwtDecode(token);
        return !!(decodedToken.exp && decodedToken.exp * 1000 < Date.now());
    };

    const logout = () => {
        localStorage.removeItem("token");
        setCurrentUser({});
    };

    useEffect(() => {
        const fetchToken = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                if (!isTokenExpired(token)) {
                    const decodedToken = jwtDecode(token);
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
                        profile: db_user
                    });
                } else {
                    logout();
                }
            }
        };

        fetchToken();
    }, []);

    return [currentUser, logout];
};
