import { useQuery } from "@tanstack/react-query";
import { UsuariosTemplate } from "../components/templates/UsuariosTemplate";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";

export function Usuarios() {
    const { datapermisos, permisosListos, mostrarModulos, mostrarUsuariosTodos, dataUsuarios } = useUsuariosStore();
    const { dataempresa } = useEmpresaStore();

    const empresaId = dataempresa?.id ?? dataempresa?.[0]?.id;
    const statePermiso = datapermisos.some(
        (objeto) => objeto.modulos?.nombre?.includes("Personal")
    );

    const { isLoading, error } = useQuery({
        queryKey: ["Mostrar Usuarios", { id_empresa: empresaId }],
        queryFn: () => mostrarUsuariosTodos({ _id_empresa: empresaId }),
        enabled: !!empresaId && statePermiso
    });

    useQuery({
        queryKey: ["mostrar modulos"],
        queryFn: () => mostrarModulos(),
        enabled: statePermiso
    });

    if (!permisosListos) return <SpinnerLoader />;
    if (!statePermiso) return <BloqueoPagina modulo="Usuarios" />;
    if (isLoading) return <SpinnerLoader />;
    if (error) return <span>Error</span>;

    return <UsuariosTemplate data={dataUsuarios} />;
}