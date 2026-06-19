import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { ProtectedRoute } from "../hooks/ProtectedRoute";
import { UserAuth } from "../context/AuthContext";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useQuery } from "@tanstack/react-query";
import { ErrorMolecula } from "../components/moleculas/ErrorMolecula";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { Marca } from "../pages/Marca";
import { Configuracion } from "../pages/Configuracion";
import { Categoria } from "../pages/Categoria";
import { Productos } from "../pages/Productos";
import { Usuarios } from "../pages/Usuarios";
import { MostrarUsuarios } from "../supabase/crudUsuarios";

export function MyRoutes() {
    const { user } = UserAuth();
    const { mostrarEmpresa } = useEmpresaStore();
    const { aplicarPermisosNavegacion } = useUsuariosStore();

    // 1. Obtener el registro del usuario en tabla usuarios
    const { data: usuarioData, isLoading, error } = useQuery({
        queryKey: ["usuario auth", user?.id],
        queryFn: () => MostrarUsuarios(),
        enabled: !!user,
        retry: false,
    });

    // 2. Cargar la empresa asociada al usuario
    const { isLoading: isLoadingEmpresa, error: errorEmpresa } = useQuery({
        queryKey: ["empresa", usuarioData?.id],
        queryFn: () => mostrarEmpresa({ idusuario: usuarioData.id }),
        enabled: !!usuarioData?.id,
        retry: false,
    });

    // 3. Aplicar permisos de navegación según los módulos asignados al usuario
    useQuery({
        queryKey: ["permisos navegacion", usuarioData?.id],
        queryFn: () => aplicarPermisosNavegacion(usuarioData.id),
        enabled: !!usuarioData?.id,
        retry: false,
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