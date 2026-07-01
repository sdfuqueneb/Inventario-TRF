import { supabase } from "../supabase/supabase.config";
import Swal from "sweetalert2";

export async function InsertarKardex(p) {
  const { error } = await supabase.from("kardex").insert(p);
  if (error) {
    Swal.fire({ icon: "error", title: "Oops...", text: error.message });
  }
}

export async function EditarKardex(p) {
  const { error } = await supabase.from("kardex").update(p).eq("id", p.id);
  if (error) {
    Swal.fire({ icon: "error", title: "Oops...", text: error.message });
  }
}

export async function EliminarKardex(p) {
  const { error } = await supabase.from("kardex").delete().eq("id", p.id);
  if (error) {
    Swal.fire({ icon: "error", title: "Oops...", text: error.message });
  }
}

export async function MostrarKardex(p) {
  const { data, error } = await supabase
    .from("kardex")
    .select(`
      *,
      productos (
        descripcion
      ),
      usuarios (
        nombres
      )
    `)
    .eq("id_empresa", p.id_empresa)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error en MostrarKardex:", error.message);
    return [];
  }

  return data.map((item) => ({
    ...item,
    descripcion: item.productos?.descripcion || "Sin descripción",
    nombres: item.usuarios?.nombres || "Sin usuario",
  }));
}

export async function BuscarKardex(p) {
  const { data, error } = await supabase
    .from("kardex")
    .select(`
      *,
      productos (
        descripcion
      ),
      usuarios (
        nombres
      )
    `)
    .eq("id_empresa", p.id_empresa)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error en BuscarKardex:", error.message);
    return [];
  }

  const dataAplanada = data.map((item) => ({
    ...item,
    descripcion: item.productos?.descripcion || "Sin descripción",
    nombres: item.usuarios?.nombres || "Sin usuario",
  }));

  if (p.buscador) {
    const termino = p.buscador.toLowerCase();
    return dataAplanada.filter(
      (item) =>
        item.descripcion.toLowerCase().includes(termino) ||
        item.detalle?.toLowerCase().includes(termino) ||
        item.nombres.toLowerCase().includes(termino)
    );
  }

  return dataAplanada;
}