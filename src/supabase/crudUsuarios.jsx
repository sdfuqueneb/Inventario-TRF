import Swal from "sweetalert2";
import { supabase } from "./supabase.config"
import { ObtenerIdAuthSupabase } from "./globalSupabase";

export const InsertarUsuarios = async (p) => {
    const {data, error} = await supabase.from("usuarios").insert(p).select().maybeSingle();
    if (error){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ha ocurrido un error al insertar un usuario " + error.message,
        });
    }
    if (data) return data;
}

export const MostrarUsuarios = async () => {
    const idAuthSupabase = await ObtenerIdAuthSupabase();
    const { error, data } = await supabase.from("usuarios").select().eq("idauth", idAuthSupabase).maybeSingle();
    if (error) {
        throw error;
    }
    return data ?? null;
}