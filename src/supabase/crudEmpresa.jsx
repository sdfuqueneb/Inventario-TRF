import { supabase } from "./supabase.config"
import { ObtenerIdAuthSupabase } from "./globalSupabase";

export const MostrarEmpresa = async (p) => {
    const idAuthSupabase = await ObtenerIdAuthSupabase();
    const { error, data } = await supabase
    .from("asignar_empresa")
    .select(`empresa(id, nombre, simbolomoneda)`)
    .eq("idusuario", p.id_usuario)
    .maybeSingle();
    if(data){
        return data;
    }
}