// Usuarios.jsx
import { useQuery } from "@tanstack/react-query";
import { UsuariosTemplate } from "../components/templates/UsuariosTemplate";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";

export function Usuarios() {
    const { mostrarUsuariosTodos, dataUsuarios } = useUsuariosStore(); 
    const { dataempresa } = useEmpresaStore();
    const empresaId = dataempresa?.id ?? dataempresa?.[0]?.id;
    
    const { isLoading, error } = useQuery({
        queryKey: ["Mostrar Usuarios", { id_empresa: empresaId }],
        queryFn: () => mostrarUsuariosTodos({ _id_empresa: empresaId }), 
        enabled: !!empresaId
    });

    if (isLoading) return <SpinnerLoader />;
    if (error) return <span>Error</span>;

    return <UsuariosTemplate data={dataUsuarios} />;
}