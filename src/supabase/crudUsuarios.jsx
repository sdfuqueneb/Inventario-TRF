import Swal from "sweetalert2";
import { supabase } from "./supabase.config";
import { ObtenerIdAuthSupabase } from "./globalSupabase";

export const InsertarUsuarios = async (p) => {
const { data, error } = await supabase.from("usuarios").insert(p).select().maybeSingle();
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ha ocurrido un error al insertar un usuario: " + error.message,
    });
    return null;
  }
  return data;
};

export const MostrarUsuarios = async () => {
const idAuthSupabase = await ObtenerIdAuthSupabase();
  const { error, data } = await supabase.from("usuarios").select().eq("idauth", idAuthSupabase).maybeSingle();
  if (error) {
    throw error;
  }
  return data ?? null;
};

export const EditarUsuarios = async (p) => {
  const { data, error } = await supabase.from("usuarios").update(p).eq("id", p.id).select();
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Error al editar",
      text: error.message,
    });
    return null;
  }
  return data;
};

export const EliminarUsuarios = async (p) => {
  const { error } = await supabase.from("usuarios").delete().eq("id", p.id);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Error al eliminar",
      text: error.message,
    });
    return false;
  }
  return true;
};

export const BuscarUsuarios = async (p) => {
  const { data, error } = await supabase.rpc("buscarpersonal", {
    _id_empresa: p.id_empresa,
    _buscador: p.buscador
  });
  if (error) {
    console.error("Error en búsqueda:", error.message);
    return [];
  }
  return data ?? [];
};

//Asignaciones
export const InsertarAsignaciones = async (p) => {
  const { error } = await supabase.from("asignar_empresa").insert(p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ha ocurrido un error al insertar un usuario: " + error.message,
    });
    return null;
  }
};

//Permisos
export const InsertarPermisos = async (p) => {
  const { error } = await supabase.from("permisos").insert(p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ha ocurrido un error al insertar permisos: " + error.message,
    });
    return null;
  }
};

export const MostrarPermisos = async (p) => {
  const { data } = await supabase
    .from("permisos")
    .select(`id, id_usuario, id_modulo, modulos(nombre)`)
    .eq("id_usuario", p.id_usuario)
  return data;
};

export const EliminarPermisos = async (p) => {
  const { error } = await supabase
    .from("permisos")
    .delete()
    .eq("id_usuario", p.id_usuario);
  if (error) {
    alert ("Error al eliminar ", error);
  }
};