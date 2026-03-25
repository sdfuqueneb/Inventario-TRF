import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { ProtectedRoute } from "../hooks/ProtectedRoute"
import { UserAuth } from "../context/AuthContext";
import { useUsuariosStore } from "../store/UsuariosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useQuery } from "@tanstack/react-query";
import { ErrorMolecula } from "../components/moleculas/ErrorMolecula";
import { useEmpresaStore } from "../store/EmpresaStore";
import { MarcaTemplate } from "../components/templates/MarcaTemplate";
import { Configuracion } from "../pages/Configuracion";

export function MyRoutes() {
    const {user} = UserAuth();
    const {mostrarUsuarios, idusuario} = useUsuariosStore();
    const {mostrarEmpresa} = useEmpresaStore();
    const {data, isLoading, error} = useQuery({
        queryKey:["Mostrar usuarios"], 
        queryFn:mostrarUsuarios
    });
    const { data: dataempresa } = useQuery({
        queryKey: ["Mostrar empresa", data?.id],
        queryFn: () => mostrarEmpresa({ idusuario: data.id }),
        enabled: !!data?.id
    });

    if (isLoading){
        return <SpinnerLoader/>
    }
    if (error){
        return <ErrorMolecula mensaje={error.message}/>
    }
    return(
        <Routes>            
            <Route path="/login" element={<Login/>}/>
            <Route element={<ProtectedRoute user={user} redirectTo="/login"/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/configurarcuenta" element={<Configuracion/>}/>
                <Route path="/configurarcuenta/marca" element={<MarcaTemplate/>}/>
            </Route>
        </Routes>
    )
}