import { supabase } from "./supabase.config";
import Swal from "sweetalert2";

export async function InsertarKardex(p) {
    const { error } = await supabase.from("kardex").insert(p);
    if (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
        });
    }
}

export async function MostrarKardex(p) {
    const { data } = await supabase
        .rpc("mostrarkardexempresa", {
            _id_empresa: p.id_empresa,
        })
        .order("id", { ascending: false });
    return data ?? [];
}

export async function EditarKardex(p) {
    const { error } = await supabase
        .from("kardex")
        .update(p)
        .eq("id", p.id);
    if (error) {
        Swal.fire({
            icon: "error",
            title: "Error al editar Kardex",
            text: error.message,
        });
    }
}

export async function EliminarKardex(p) {
    const { error } = await supabase
        .from("kardex")
        .delete()
        .eq("id", p.id);
    if (error) {
        Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: error.message,
        });
    }
}

export async function BuscarKardex(p) {
    const { data } = await supabase
        .rpc("buscarkardexempresa", {
            _id_empresa: p.id_empresa,
            buscador: p.buscador ?? p.descripcion,
        })
        .order("id", { ascending: false });
    return data ?? [];
}