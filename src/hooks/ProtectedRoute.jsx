import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "../context/AuthContext"; 

export const ProtectedRoute = ({ redirectTo, children }) => {
    const { user, loading } = UserAuth();

    if (loading) return null; 

    if (user == null) {
        return <Navigate replace to={redirectTo} />;
    }
    
    return children ? children : <Outlet />;
};