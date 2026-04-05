import { useQuery } from "@tanstack/react-query";
import { MarcaTemplate } from "../components/templates/MarcaTemplate"
import { useEmpresaStore } from "../store/EmpresaStore";
import { useMarcaStore } from "../stores/MarcaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";

export function Marca() {
    const {mostrarMarca, datamarca, buscarMarca, buscador} = useMarcaStore();
    const {dataempresa} = useEmpresaStore();
    const empresaId = dataempresa?.empresa?.id;
    const {isLoading, error} = useQuery({ queryKey: ["Mostrar marca", {id_empresa: empresaId}], 
                                queryFn: () => mostrarMarca({id_empresa: empresaId}), enabled: empresaId != null});
    const {data: buscardata} = useQuery({ queryKey: ["Buscar marca", {id_empresa: empresaId, descripcion: buscador}], 
                                queryFn: () => buscarMarca({id_empresa: empresaId, descripcion: buscador}), enabled: empresaId != null});
    if (isLoading) {
        return <SpinnerLoader/>;
    } if (error) {
        return <span>Error</span>
    }
    return (<MarcaTemplate data = {datamarca}/>);
}
