import { useQuery } from "@tanstack/react-query";
import { MarcaTemplate } from "../components/templates/MarcaTemplate"
import { useEmpresaStore } from "../store/EmpresaStore";
import { useMarcaStore } from "../store/MarcaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";

export function Marca() {
    const {mostrarMarca, datamarca, buscarMarca, buscador} = useMarcaStore();
    const {dataempresa} = useEmpresaStore();
    const empresaId = dataempresa?.empresa?.id;
    const {isLoading, error} = useQuery({ queryKey: ["Mostrar marca", {id_empresa: dataempresa?.id}], 
                                queryFn: () => mostrarMarca({id_empresa: dataempresa?.id}), enabled: dataempresa?.id});
    const {data: buscardata} = useQuery({ queryKey: ["Buscar marca", {id_empresa: empresaId, descripcion: buscador}], 
                                queryFn: () => buscarMarca({id_empresa: empresaId, descripcion: buscador}), enabled: !!empresaId});
    if (isLoading) {
        return <SpinnerLoader/>;
    } if (error) {
        return <span>Error</span>
    }
    return (<MarcaTemplate data = {datamarca}/>);
}
