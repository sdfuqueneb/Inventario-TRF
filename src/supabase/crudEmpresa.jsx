import { supabase } from "./supabase.config"

export const MostrarEmpresa = async (p) => {
    const { error, data } = await supabase
    .from("asignar_empresa")
    .select(`empresa(id, nombre, simbolomoneda)`)
    .eq("id_usuario", p.idusuario)
    .maybeSingle();
    if (error) {
        console.error("Error al obtener empresa:", error);
        throw error;
    }
    return data ?? null;
};

export const ContarUsuariosPorEmpresa = async (p) => {
    const {data, error} = await supabase.rpc ("contar_usuarios_por_empresa", {_id_empresa: p.id_empresa});
    if (error) throw error;
    return data ?? 0; 
}