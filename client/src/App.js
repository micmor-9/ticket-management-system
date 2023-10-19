import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { AuthContext, useAuth } from "./utils/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Topbar from "./views/global/Topbar";
import Sidebar from "./views/global/Sidebar";
import Dashboard from "./views/dashboard";
import Users from "./views/users";
/* import Products from "./scenes/products"; */
import Tickets from "./views/tickets";
import Ticket from "./views/tickets/[id]";
import Products from "./views/products";
import Orders from "./views/orders";
import CreateTicket from "./views/tickets/create";

function App() {
  const [theme, colorMode] = useMode();
  const [currentUser, setCurrentUser] = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <AuthContext.Provider value={[currentUser, setCurrentUser]}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar />
            <main className="content">
              <Topbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/products" element={<Products />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/tickets/:ticketId" element={<Ticket />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="tickets/new/:orderId" element={<CreateTicket />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
