import { useQuery } from "@tanstack/react-query";
import { CategoriaTemplate } from "../components/templates/CategoriaTemplate"
import { useEmpresaStore } from "../store/EmpresaStore";
import { useCategoriaStore } from "../store/CategoriaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";

export function Categoria() {
    const { mostrarCategoria, dataCategoria, buscarCategoria, buscador } = useCategoriaStore();
    const { dataempresa } = useEmpresaStore();

    const empresaId = dataempresa?.id;

    const { isLoading, error } = useQuery({
        queryKey: ["Mostrar Categoria", { id_empresa: empresaId }],
        queryFn: () => mostrarCategoria({ id_empresa: empresaId }),
        enabled: !!empresaId
    });

    const { data: buscardata } = useQuery({
        queryKey: ["Buscar Categoria", { id_empresa: empresaId, descripcion: buscador }],
        queryFn: () => buscarCategoria({ id_empresa: empresaId, descripcion: buscador }),
        enabled: !!empresaId
    });

    if (isLoading) return <SpinnerLoader />;
    if (error) return <span>Error</span>;

    return <CategoriaTemplate data={dataCategoria} />;
}
