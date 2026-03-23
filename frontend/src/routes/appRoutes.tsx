// Move BrowserRouter OUT — put this in main.tsx or App.tsx:
// <BrowserRouter><AppRoutes /></BrowserRouter>

import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyUser, me } from "../services/authServices";
import { userAuthStore } from "../store/auth/authStore";

import Login from "../pages/login";
import Signup from "../pages/signUp";
import Home from "../pages/dashboard";

function AppRoutes() {
    const user = userAuthStore((state) => state.user);
    const setUser = userAuthStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await verifyUser();
                
                if (res && res.status === 200) {
                    const userData = await me();
                    if (userData) setUser(userData.data);
                }
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [setUser]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/login" />}
            />
            <Route
                path="/login"
                element={user ? <Navigate to="/home" /> : <Login />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route
                path="/home"
                element={user ? <Home /> : <Navigate to="/login" />}
            />
        </Routes>
    );
}

export default AppRoutes;