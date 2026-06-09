import {supabase} from "./supabase.config"
import Swal from "sweetalert2"

export async function InsertarProductos(p) {
    const { error } = await supabase.rpc("insertarproductos", {
        _codigobarras: p._codigobarras,
        _descripcion: p._descripcion,
        _id_categoria: p._id_categoria,
        _id_empresa: p._id_empresa,
        _id_marca: p._id_marca,
        _placa: p._placa,
        _preciocompra: p._preciocompra,
        _stock: p._stock,
        _stock_minimo: p._stock_minimo,
    });
    if (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
            footer: '<a href="">Agregue una nueva descripción</a>',
        });
    }
}

export async function MostrarProductos(p) {
 
    const { data } = await supabase
      .from("productos")
      .select()
      .eq("id_empresa", p.id_empresa)
      .order("id", { ascending: true });
    return data ?? [];
  
}
export async function EliminarProductos(p) {
 
    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", p.id);
    if (error) {
      alert("Error al eliminar", error.message);
    }

}
export async function EditarProductos(p) {
    const { error } = await supabase
      .from("productos")
      .update(p)
      .eq("id", p.id);
    if (error) {
      alert("Error al editar Productos", error.message);
    }

}
export async function BuscarProductos(p) {
    const { data} = await supabase
    .from("productos")
    .select()
    .eq("id_empresa", p.id_empresa)
    .ilike("descripcion","%"+p.descripcion+"%")
    return data ?? [];
}