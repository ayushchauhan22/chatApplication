import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyUser } from "../services/authServices";
import { Navigate } from "react-router-dom";


import Login from "../pages/login";
import Signup from "../pages/signUp";
import Home from "../pages/home";

// import ProtectedRoute from "./protectedRoute";
function AppRoutes() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await verifyUser();
                if (res.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        console.log("Auth state changed:", isAuthenticated);
    }, [isAuthenticated]);

    return (
        <BrowserRouter>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/home"
                    element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
                // element={<Home />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;