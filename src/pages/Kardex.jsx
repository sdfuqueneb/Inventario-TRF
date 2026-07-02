import { useQuery } from "@tanstack/react-query";
import { KardexTemplate } from "../components/templates/KardexTemplate";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useKardexStore } from "../store/KardexStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";

export function Kardex() {
    const { datapermisos, permisosListos } = useUsuariosStore();
    const { mostrarKardex, dataKardex, buscarKardex, buscador } = useKardexStore();
    const { dataempresa } = useEmpresaStore();

    const empresaId = dataempresa?.id;
    const statePermiso = datapermisos.some(
        (objeto) => objeto.modulos?.nombre?.includes("Kardex")
    );

    const { isLoading, error } = useQuery({
        queryKey: ["Mostrar Kardex", { id_empresa: empresaId }],
        queryFn: () => mostrarKardex({ id_empresa: empresaId }),
        enabled: !!empresaId && statePermiso
    });

    useQuery({
        queryKey: ["Buscar Kardex", { id_empresa: empresaId, descripcion: buscador }],
        queryFn: () => buscarKardex({ id_empresa: empresaId, descripcion: buscador }),
        enabled: !!empresaId && statePermiso
    });

    if (!permisosListos) return <SpinnerLoader />;
    if (!statePermiso) return <BloqueoPagina modulo="Kardex" />;
    if (isLoading) return <SpinnerLoader />;
    if (error) return <span>Error</span>;

    return <KardexTemplate data={dataKardex} />;
}