import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductosTemplate } from "../components/templates/ProductosTemplate";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useMarcaStore } from "../store/MarcaStore";
import { useCategoriaStore } from "../store/CategoriaStore";

export function Productos() {
    const { mostrarProductos, dataProductos, buscarProductos } = useProductosStore();
    const { dataempresa } = useEmpresaStore();
    const { mostrarMarca } = useMarcaStore();
    const { mostrarCategoria } = useCategoriaStore();

    const [buscador, setBuscador] = useState("");

    const empresaId = dataempresa?.id ?? dataempresa?.[0]?.id;    
    const esEmpresaValida = !!empresaId && empresaId !== "undefined";

    const { isLoading, error } = useQuery({
        queryKey: ["Mostrar Productos", empresaId],
        queryFn: () => mostrarProductos({ id_empresa: Number(empresaId) }),
        enabled: esEmpresaValida
    });

    const { data: buscardata } = useQuery({
        queryKey: ["Mostrar marca", empresaId],
        queryFn: () => mostrarMarca({ id_empresa: Number(empresaId) }),
        enabled: esEmpresaValida 
    });

    const { data: datamarcas } = useQuery({
        queryKey: ["Mostrar Categoria", empresaId],
        queryFn: () => mostrarCategoria({ 
            id_empresa: Number(empresaId), 
            _id_empresa: Number(empresaId)
        }), 
        enabled: esEmpresaValida
    });

    useQuery({
        queryKey: ["Buscar Productos", empresaId, buscador],
        queryFn: () => buscarProductos({ id_empresa: Number(empresaId), descripcion: buscador }),
        enabled: esEmpresaValida && buscador.trim() !== ""
    });

    if (!esEmpresaValida) return <SpinnerLoader />;
    if (isLoading) return <SpinnerLoader />;

    if (error) return <span>Error al cargar los datos en el servidor</span>;

    return (
        <ProductosTemplate 
            data={dataProductos} 
            buscador={buscador} 
            setBuscador={setBuscador} 
        />
    );
}
