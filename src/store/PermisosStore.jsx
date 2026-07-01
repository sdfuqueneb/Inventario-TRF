import { create } from "zustand";
import { MostrarPermisos } from "../supabase/crudPermisos";
import { DataModulosConfiguracion } from "../utils/dataEstatica";

export const usePermisosStore = create((set, get) => ({
  datapermisos: [],
  datapermisosEdit: [],
  permisosListos: false,

  mostrarPermisos: async (p) => {
    const response = await MostrarPermisos(p);
    set({ datapermisos: response });
    let allDocs = [];
    DataModulosConfiguracion.map((element) => {
      const statePermiso = response.some((objeto) =>
        objeto.modulos.nombre.includes(element.title)
      );
      if (statePermiso) {
        allDocs.push({ ...element, state: true });
      } else {
        allDocs.push({ ...element, state: false });
      }
    });
    DataModulosConfiguracion.splice(0, DataModulosConfiguracion.length);
    DataModulosConfiguracion.push(...allDocs);
    set({ permisosListos: true });
    return response;
  },

  mostrarPermisosEdit: async (p) => {
    const response = await MostrarPermisos(p);
    set({ datapermisosEdit: response });
    return response;
  },
}));