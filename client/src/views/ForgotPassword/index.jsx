// ForgotPassword.js
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { resetPassword } from "../../api/auth/authApi";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleResetPassword = (event) => {
        event.preventDefault();
        resetPassword(email)
            .then((response) => {

                navigate("/login");
            })
            .catch((error) => {

                console.error("Password reset failed:", error);
            });
    };

    return (
        <form onSubmit={handleResetPassword}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Reset Password
            </Button>
        </form>
    );
};

export default ForgotPassword;
