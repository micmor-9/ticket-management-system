import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { AuthContext, useAuth } from "./utils/AuthContext";
import Topbar from "./views/global/Topbar";
import Sidebar from "./views/global/Sidebar";
import Dashboard from "./views/dashboard";
import Login from "./views/login";
import Users from "./views/users";
/* import Products from "./scenes/products"; */
import Tickets from "./views/tickets";
import Ticket from "./views/tickets/[id]";
/* import Orders from "./scenes/orders"; */

function App() {
  const [theme, colorMode] = useMode();
  const [currentUser, setCurrentUser] = useAuth();

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
                <Route path="/login" element={<Login />} />
                {/* <Route path="/products" element={<Products />} /> */}
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/tickets/:ticketId" element={<Ticket />} />
                {/* <Route path="/orders" element={<Orders />} /> */}
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
