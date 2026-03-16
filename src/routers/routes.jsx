import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { ProtectedRoute } from "../hooks/ProtectedRoute"
import { UserAuth } from "../context/AuthContext";

export function MyRoutes() {
    const {user} = UserAuth()
    return(
        <Routes>            
            <Route path="/login" element={<Login/>}/>
            <Route element={<ProtectedRoute user={user} redirectTo="/login"/>}>
                <Route path="/" element={<Home/>}/>
            </Route>
        </Routes>
    )
}