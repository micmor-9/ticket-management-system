import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState({});

  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser({});
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      if (!isTokenExpired(token)) {
        const decodedToken = jwtDecode(token);

        setCurrentUser({
          email: decodedToken.email,
          name: decodedToken.given_name,
          surname: decodedToken.family_name,
          username: decodedToken.preferred_username,
          role: decodedToken.resource_access["springboot-keycloak-client"]
            .roles[0],
        });
      } else {
        logout();
      }
    }
  }, []);

  return [currentUser, logout];
};
