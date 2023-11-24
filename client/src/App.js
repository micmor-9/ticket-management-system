import {ColorModeContext, useMode} from "./theme";
import {CssBaseline, GlobalStyles, ThemeProvider} from "@mui/material";
import {Routes, Route, useLocation} from "react-router-dom";
import {AuthContext, useAuth} from "./utils/AuthContext";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Topbar from "./views/global/Topbar";
import Sidebar from "./views/global/Sidebar";
import Dashboard from "./views/dashboard";
import Users from "./views/users";
import Tickets from "./views/tickets";
import Ticket from "./views/tickets/[id]";
import Products from "./views/products";
import Orders from "./views/orders";
import CreateTicket from "./views/tickets/create";
import CreateUser from "./views/users/create";
import MyAccount from "./views/myaccount";

import CreateUserForm from "./components/forms/CreateUserForm";
import Signup from "./views/Signup";

import {NotificationsContext, useNotifications} from "./utils/NotificationsContext";


function App() {
    const [theme, colorMode] = useMode();
    const [currentUser, setCurrentUser] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useNotifications();

    const token = localStorage.getItem("token");

    useEffect(() => {

        if (!token && window.location.pathname !== '/signup') {

            navigate("/login");
        }
    }, [token, navigate]);

    return (
        <AuthContext.Provider value={[currentUser, setCurrentUser]}>
            <ColorModeContext.Provider value={colorMode}>

                <NotificationsContext.Provider value={[notifications, setNotifications]}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>
                        <GlobalStyles styles={{
                            "*::-webkit-scrollbar": {
                                width: "5px",
                            },
                            "*::-webkit-scrollbar-track": {
                                backgroundColor: "transparent",
                            },
                            "*::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgba(0, 0, 0, 0.2)",
                                borderRadius: "3px",
                            },
                            "*::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                            },
                            "*::-webkit-scrollbar-thumb:active": {
                                backgroundColor: "rgba(0, 0, 0, 0.4)",
                            },
                        }}/>
                        <div className="app">
                            <Sidebar/>
                            <main className="content">
                                <Topbar/>
                                <Routes>
                                    <Route path="/" element={<Dashboard/>}/>
                                    <Route path="/users" element={<Users/>}/>
                                    <Route path="/users/create" element={<CreateUser/>}/>
                                    <Route path="/products" element={<Products/>}/>
                                    <Route path="/tickets" element={<Tickets/>}/>
                                    <Route path="/tickets/:ticketId" element={<Ticket/>}/>
                                    <Route path="/orders" element={<Orders/>}/>
                                    <Route path="/tickets/create/:orderId" element={<CreateTicket/>}/>
                                    <Route path="/tickets/create" element={<CreateTicket/>}/>
                                    <Route path="/myaccount" element={<MyAccount/>}/>
                                </Routes>
                            </main>
                        </div>
                    </ThemeProvider>
                </NotificationsContext.Provider>
            </ColorModeContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;
