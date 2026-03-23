import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
    isAuth: boolean;
    children: ReactNode;
};

function ProtectedRoute({ children, isAuth }: ProtectedRouteProps) {
    if (!isAuth) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;