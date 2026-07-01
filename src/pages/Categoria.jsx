import { useQuery } from "@tanstack/react-query";
import { CategoriaTemplate } from "../components/templates/CategoriaTemplate";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useCategoriaStore } from "../store/CategoriaStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";

export function Categoria() {
    const { datapermisos, permisosListos } = useUsuariosStore();
    const { mostrarCategoria, dataCategoria, buscarCategoria, buscador } = useCategoriaStore();
    const { dataempresa } = useEmpresaStore();

    const empresaId = dataempresa?.id;
    const statePermiso = datapermisos.some(
        (objeto) => objeto.modulos?.nombre?.includes("Categoria")
    );

    const { isLoading, error } = useQuery({
        queryKey: ["Mostrar Categoria", { id_empresa: empresaId }],
        queryFn: () => mostrarCategoria({ id_empresa: empresaId }),
        enabled: !!empresaId && statePermiso
    });

    useQuery({
        queryKey: ["Buscar Categoria", { id_empresa: empresaId, descripcion: buscador }],
        queryFn: () => buscarCategoria({ id_empresa: empresaId, descripcion: buscador }),
        enabled: !!empresaId && statePermiso
    });

    if (!permisosListos) return <SpinnerLoader />;
    if (!statePermiso) return <BloqueoPagina modulo="Categorias" />;
    if (isLoading) return <SpinnerLoader />;
    if (error) return <span>Error</span>;

    return <CategoriaTemplate data={dataCategoria} />;
}