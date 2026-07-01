import { useQuery } from "@tanstack/react-query";
import { MarcaTemplate } from "../components/templates/MarcaTemplate";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useMarcaStore } from "../store/MarcaStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";

export function Marca() {
    const { datapermisos, permisosListos } = useUsuariosStore();
    const { mostrarMarca, datamarca, buscarMarca, buscador } = useMarcaStore();
    const { dataempresa } = useEmpresaStore();

    const empresaId = dataempresa?.id;
    const statePermiso = datapermisos.some(
        (objeto) => objeto.modulos?.nombre?.includes("Marca")
    );

    const { isLoading, error } = useQuery({
        queryKey: ["Mostrar marca", { id_empresa: empresaId }],
        queryFn: () => mostrarMarca({ id_empresa: empresaId }),
        enabled: !!empresaId && statePermiso
    });

    useQuery({
        queryKey: ["Buscar marca", { id_empresa: empresaId, descripcion: buscador }],
        queryFn: () => buscarMarca({ id_empresa: empresaId, descripcion: buscador }),
        enabled: !!empresaId && statePermiso
    });

    if (!permisosListos) return <SpinnerLoader />;
    if (!statePermiso) return <BloqueoPagina modulo="Marca" />;
    if (isLoading) return <SpinnerLoader />;
    if (error) return <span>Error</span>;

    return <MarcaTemplate data={datamarca} />;
}