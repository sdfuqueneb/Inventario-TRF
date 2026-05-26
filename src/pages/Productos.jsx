import { useQuery } from "@tanstack/react-query";
import { ProductosTemplate } from "../components/templates/ProductosTemplate"
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useMarcaStore } from "../store/MarcaStore";
import { useCategoriaStore } from "../store/CategoriaStore";

export function Productos() {
    const { mostrarProductos, dataProductos, buscarProductos, buscador } = useProductosStore();
    const { dataempresa } = useEmpresaStore();
    const { mostrarMarca } = useMarcaStore();
    const { mostrarCategoria } = useCategoriaStore();

    const empresaId = dataempresa?.id;

    const { isLoading, error } = useQuery({
        queryKey: ["Mostrar Productos", { id_empresa: empresaId }],
        queryFn: () => mostrarProductos({ id_empresa: empresaId }),
        enabled: !!empresaId
    });

    const { data: buscardata } = useQuery({
        queryKey: ["Buscar Productos", { id_empresa: empresaId, descripcion: buscador }],
        queryFn: () => buscarProductos({ id_empresa: empresaId, descripcion: buscador }),
        enabled: !!empresaId
    });

    const { data: datamarcas } = useQuery({
        queryKey: ["Mostrar marca", { id_empresa: empresaId }],
        queryFn: () => mostrarMarca({ id_empresa: empresaId }),
        enabled: !!empresaId
    });

    useQuery({
        queryKey: ["Mostrar Categoria", { id_empresa: empresaId }],
        queryFn: () => mostrarCategoria({ id_empresa: empresaId }),
        enabled: !!empresaId
    });

    if (isLoading) return <SpinnerLoader />;
    if (error) return <span>Error</span>;

    return <ProductosTemplate data={dataProductos} />;
}
