import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import type { Role } from "../types";

type ProtectedRouteProps = {
    allowedRoles?: Role[];
}

function getHomePath(role: Role) {
    return role === "DRIVER" ? "/driver" : "/passenger";
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { token, user, loading } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={getHomePath(user.role)} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
