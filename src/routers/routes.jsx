import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { ProtectedRoute } from "../hooks/ProtectedRoute"
import { UserAuth } from "../context/AuthContext";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useQuery } from "@tanstack/react-query";
import { ErrorMolecula } from "../components/moleculas/ErrorMolecula";
import { useEmpresaStore } from "../store/EmpresaStore";
import { Marca } from "../pages/Marca";
import { Configuracion } from "../pages/Configuracion";
import { Categoria } from "../pages/Categoria";
import { Productos } from "../pages/Productos";
import { Usuarios } from "../pages/Usuarios";
import { MostrarUsuarios } from "../supabase/crudUsuarios"; 

export function MyRoutes() {
    const { user } = UserAuth();
    const { mostrarEmpresa } = useEmpresaStore();
    // ✅ Ya NO importes useUsuariosStore aquí

    const { data: usuarioData, isLoading, error } = useQuery({
        queryKey: ["usuario auth", user?.id],
        queryFn: () => MostrarUsuarios(), 
        enabled: !!user
    });

    const { isLoading: isLoadingEmpresa } = useQuery({
        queryKey: ["empresa", usuarioData?.id],
        queryFn: () => mostrarEmpresa({ idusuario: usuarioData.id }),
        enabled: !!usuarioData?.id
    });

    if (isLoading || isLoadingEmpresa) return <SpinnerLoader />;
    if (error) return <ErrorMolecula mensaje={error.message} />;

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute user={user} redirectTo="/login" />}>
                <Route path="/" element={<Home />} />
                <Route path="/configurarcuenta" element={<Configuracion />} />
                <Route path="/configurarcuenta/marca" element={<Marca />} />
                <Route path="/configurarcuenta/categoria" element={<Categoria />} />
                <Route path="/configurarcuenta/productos" element={<Productos />} />
                <Route path="/configurarcuenta/usuarios" element={<Usuarios />} />
            </Route>
        </Routes>
    );
}