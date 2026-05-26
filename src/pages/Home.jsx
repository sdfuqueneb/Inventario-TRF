import { HomeTemplate } from "../components/templates/HomeTemplate"
import { useEmpresaStore } from "../store/EmpresaStore";
import { useQuery } from "@tanstack/react-query";

export function Home() {
    const { ContarUsuariosPorEmpresa, dataempresa } = useEmpresaStore();
    
    const { data } = useQuery({
        queryKey: ["Contar usuarios por empresa", { idempresa: dataempresa?.id }],
        queryFn: () => ContarUsuariosPorEmpresa({ id_empresa: dataempresa?.id }),
        enabled: !!dataempresa?.id 
    });

    return <HomeTemplate />;
}
