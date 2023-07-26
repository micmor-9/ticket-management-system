import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      setCurrentUser({
        email: decodedToken.email,
        name: decodedToken.given_name,
        surname: decodedToken.family_name,
        username: decodedToken.preferred_username,
        role: decodedToken.resource_access["springboot-keycloak-client"]
          .roles[0],
      });
    }
  }, []);

  return [currentUser, setCurrentUser];
};
