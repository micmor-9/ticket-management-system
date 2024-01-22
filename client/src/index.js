import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./views/login";
import {DialogProvider} from "./utils/DialogContext";
import Signup from "./views/signup";
import ForgotPassword from "./views/login/forgotPassword";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <DialogProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<App/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                </Routes>
            </BrowserRouter>
        </DialogProvider>
    </React.StrictMode>
);
