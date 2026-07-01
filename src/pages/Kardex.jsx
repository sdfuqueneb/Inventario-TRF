import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { useProductosStore } from "../store/ProductosStore";
import { KardexTemplate } from "../components/templates/KardexTemplate";
import { useKardexStore } from "../store/KardexStore";
import { usePermisosStore } from "../store/PermisosStore";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";

export function Kardex() {
  const { datapermisos, permisosListos } = usePermisosStore();
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos?.nombre?.includes("Kardex")
  );

  const { mostrarProductos } = useProductosStore();
  const {
    mostrarKardex,
    buscarKardex,
    buscador: buscadorkardex,
    datakardex,
  } = useKardexStore();
  const { dataempresa } = useEmpresaStore();

  const empresaId = dataempresa?.id ?? dataempresa?.[0]?.id ?? null;

  useQuery({
    queryKey: ["productos", empresaId],
    queryFn: () => mostrarProductos({ id_empresa: empresaId }),
    enabled: empresaId !== null && permisosListos && statePermiso,
  });

  const { isLoading, error } = useQuery({
    queryKey: ["kardex", empresaId, buscadorkardex],
    queryFn: () => {
      if (buscadorkardex) {
        return buscarKardex({ buscador: buscadorkardex, id_empresa: empresaId });
      }
      return mostrarKardex({ id_empresa: empresaId });
    },
    enabled: empresaId !== null && permisosListos && statePermiso,
  });

  if (!permisosListos) return <SpinnerLoader />;
  if (!statePermiso) return <BloqueoPagina modulo="Kardex" />;
  
  if (empresaId === null) return <SpinnerLoader />;
  
  if (isLoading) return <SpinnerLoader />;
  if (error) return <span>Error al cargar los datos...</span>;

  return <KardexTemplate data={datakardex} />;
}