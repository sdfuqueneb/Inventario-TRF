import { HomeTemplate } from "../components/templates/HomeTemplate"
import { useEmpresaStore } from "../store/EmpresaStore";
import { useQuery } from "@tanstack/react-query";

export function Home() {
    const { ContarUsuariosPorEmpresa, dataempresa } = useEmpresaStore();
    const {data} = useQuery({queryKey: ["Contar usuarios por empresa", 
        {idempresa: dataempresa.empresa?.id}], queryFn: () => ContarUsuariosPorEmpresa
        ({id_empresa: dataempresa.empresa?.id}), enabled: !!dataempresa?.empresa?.id })
    return (<HomeTemplate/>);
}
