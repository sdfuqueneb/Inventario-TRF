import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductosTemplate } from "../components/templates/ProductosTemplate";
import { useEmpresaStore } from "../store/EmpresaStore";
import { useProductosStore } from "../store/ProductosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useMarcaStore } from "../store/MarcaStore";
import { useCategoriaStore } from "../store/CategoriaStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";

export function Productos() {
    const { datapermisos, permisosListos } = useUsuariosStore();
    const { mostrarProductos, dataProductos, buscarProductos } = useProductosStore();
    const { dataempresa } = useEmpresaStore();
    const { mostrarMarca } = useMarcaStore();
    const { mostrarCategoria } = useCategoriaStore();
    const [buscador, setBuscador] = useState("");

    const empresaId = dataempresa?.id ?? dataempresa?.[0]?.id;
    const esEmpresaValida = !!empresaId && empresaId !== "undefined";


    const statePermiso = datapermisos.some(
        (objeto) => objeto.modulos?.nombre?.includes("Productos")
    );

    const { isLoading, error } = useQuery({
        queryKey: ["Mostrar Productos", empresaId],
        queryFn: () => mostrarProductos({ id_empresa: Number(empresaId) }),
        enabled: esEmpresaValida && statePermiso
    });

    const { data: buscardata } = useQuery({
        queryKey: ["Mostrar marca", empresaId],
        queryFn: () => mostrarMarca({ id_empresa: Number(empresaId) }),
        enabled: esEmpresaValida && statePermiso
    });

    const { data: datamarcas } = useQuery({
        queryKey: ["Mostrar Categoria", empresaId],
        queryFn: () => mostrarCategoria({
            id_empresa: Number(empresaId),
            _id_empresa: Number(empresaId)
        }),
        enabled: esEmpresaValida && statePermiso
    });

    useQuery({
        queryKey: ["Buscar Productos", empresaId, buscador],
        queryFn: () => buscarProductos({ id_empresa: Number(empresaId), descripcion: buscador }),
        enabled: esEmpresaValida && statePermiso && buscador.trim() !== ""
    });

    if (!permisosListos) return <SpinnerLoader />;
    if (!statePermiso) return <BloqueoPagina modulo="Productos" />;
    if (!esEmpresaValida) return <SpinnerLoader />;
    if (isLoading) return <SpinnerLoader />;
    if (error) return <span>Error al cargar los datos</span>;

    return (
        <ProductosTemplate
            data={dataProductos}
            buscador={buscador}
            setBuscador={setBuscador}
        />
    );
}