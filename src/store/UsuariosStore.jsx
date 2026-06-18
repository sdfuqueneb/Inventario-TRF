import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";
import {
  BuscarUsuarios,
  EditarUsuarios,
  EliminarUsuarios,
  InsertarAsignaciones,
  InsertarPermisos,
  InsertarUsuarios,
} from "../supabase/crudUsuarios";

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
    const idEmpresa = p._id_empresa ?? p.id_empresa;

    if (!idEmpresa) {
      console.error("mostrarUsuariosTodos: falta id_empresa");
      return [];
    }

    const { data: asignaciones, error: errAsig } = await supabase
      .from("asignar_empresa")
      .select("id_usuario")
      .eq("id_empresa", idEmpresa);

    if (errAsig) {
      console.error("Error al leer asignar_empresa:", errAsig.message);
      return [];
    }

    if (!asignaciones || asignaciones.length === 0) {
      set({ dataUsuarios: [] });
      return [];
    }

    const ids = asignaciones.map((a) => a.id_usuario);

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .in("id", ids)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error al leer usuarios:", error.message);
      return [];
    }

    set({ dataUsuarios: data ?? [] });
    return data ?? [];
  },

  InsertarUsuarios: async (parametrosAuth, p, datacheckpermisos) => {
    const {
      data: { session: adminSession },
    } = await supabase.auth.getSession();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parametrosAuth.correo,
      password: parametrosAuth.pass,
    });

    if (authError || !authData.user) {
      console.error("Error al crear usuario en Auth:", authError?.message);
      return null;
    }

    if (adminSession) {
      await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      });
    }

    const dataUserNew = await InsertarUsuarios({
      nombre: p.nombre,
      numero_doc: p.numero_doc,
      telefono: p.telefono,
      direccion: p.direccion,
      fecha_registro: new Date(),
      estado: "activo",
      idauth: authData.user.id,
      tipo_doc: p.tipo_doc,
      tipo_usuario: p.tipo_usuario,
      correo: p.correo,
    });

    if (!dataUserNew) return null;

    await InsertarAsignaciones({
      id_empresa: p.id_empresa,
      id_usuario: dataUserNew.id,
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
    const empresaId = p.id_empresa ?? parametros.id_empresa;
    if (empresaId) {
      await mostrarUsuariosTodos({ _id_empresa: empresaId });
    }

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
  },
}));