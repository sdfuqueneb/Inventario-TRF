import { create } from "zustand";
import { BuscarUsuarios, EditarUsuarios, EliminarUsuarios, InsertarAsignaciones, InsertarPermisos, InsertarUsuarios } from "../supabase/crudUsuarios";
import { supabase } from "../supabase/supabase.config";


export const useUsuariosStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => set({ buscador: p }),
  dataUsuarios: [],
  UsuariosItemSelect: [],
  parametros: {},
  setParametros: (p) => set({ parametros: p }),

  mostrarUsuarios: async (p) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id_empresa", p.id_empresa)
      .order("id", { ascending: true });

    if (error) return [];
    set({ dataUsuarios: data ?? [] });
    return data;
  },

  mostrarUsuariosTodos: async (p) => {
    const { data, error } = await supabase.rpc("mostrarpersonal", p);

    if (error) {
      console.error("Error en RPC mostrarpersonal:", error.message);
      return [];
    }
    set({ dataUsuarios: data ?? [] });
    return data;
  },

InsertarUsuarios: async (parametrosAuth, p, datacheckpermisos) => {
    const dataUserNew = await InsertarUsuarios({
        nombre: p.nombre,
        numero_doc: p.numero_doc,
        telefono: p.telefono,
        direccion: p.direccion,
        fecha_registro: new Date(),
        estado: "activo",
        idauth: null,
        tipo_doc: p.tipo_doc,
        tipo_usuario: p.tipo_usuario,
        correo: p.correo
    });

    if (!dataUserNew) return null;

    await InsertarAsignaciones({
        id_empresa: p.id_empresa,
        id_usuario: dataUserNew.id
    });

    datacheckpermisos.forEach(async (item) => {
        if (item.check) {
            await InsertarPermisos({
                id_usuario: dataUserNew.id, 
                id_modulo: item.id,
            });
        }
    });

    const { mostrarUsuariosTodos, parametros } = get();
    await mostrarUsuariosTodos({ _id_empresa: parametros.id_empresa });

    return dataUserNew;
},

  eliminarUsuarios: async (p) => {
    await EliminarUsuarios(p);
    const { mostrarUsuariosTodos, parametros } = get();   
    await mostrarUsuariosTodos({ _id_empresa: parametros.id_empresa });   
  },

  editarUsuarios: async (p) => {
    await EditarUsuarios(p);
    const { mostrarUsuariosTodos, parametros } = get();   
    await mostrarUsuariosTodos({ _id_empresa: parametros.id_empresa });   
  },

  buscarUsuarios: async (p) => {
    const response = await BuscarUsuarios(p);
    set({ dataUsuarios: response });
    return response ?? [];
  }
}));