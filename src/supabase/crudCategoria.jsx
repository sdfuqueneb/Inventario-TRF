import {supabase} from "./supabase.config"
import Swal from "sweetalert2"
export async function InsertarCategoria(p) {
    const {error} = await supabase.rpc("insertarcategoria", {
      _color: p._color,
      _descripcion: p._descripcion,
      _idempresa: p._idempresa,
    })
    if(error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
    }
}

export async function MostrarCategoria(p) {
 
    const { data } = await supabase
      .from("categorias")
      .select()
      .eq("id_empresa", p.id_empresa)
      .order("id", { ascending: true });
    return data ?? [];
  
}
export async function EliminarCategoria(p) {
 
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", p.id);
    if (error) {
      alert("Error al eliminar", error.message);
    }

}
export async function EditarCategoria(p) {
    const { error } = await supabase
      .from("categorias")
      .update(p)
      .eq("id", p.id);
    if (error) {
      alert("Error al editar Categoria", error.message);
    }

}
export async function BuscarCategoria(p) {
    const { data} = await supabase
    .from("categorias")
    .select()
    .eq("id_empresa", p.id_empresa)
    .ilike("descripcion","%"+p.descripcion+"%")
    return data ?? [];
}