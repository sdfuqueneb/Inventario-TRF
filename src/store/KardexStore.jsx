import { create } from "zustand";
import {
  BuscarKardex,
  EditarKardex,
  EliminarKardex,
  InsertarKardex,
  MostrarKardex,
} from "../supabase/crudKardex";

export const useKardexStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
  datakardex: [],
  kardexItemSelect: [],
  parametros: {},

  insertarKardex: async (p) => {
    await InsertarKardex(p);
    const { mostrarKardex, parametros } = get();
    await mostrarKardex(parametros);
  },

  editarKardex: async (p) => {
    await EditarKardex(p);
    const { mostrarKardex, parametros } = get();
    await mostrarKardex(parametros);
  },

  eliminarKardex: async (p) => {
    await EliminarKardex(p);
    const { mostrarKardex, parametros } = get();
    await mostrarKardex(parametros);
  },

  mostrarKardex: async (p) => {
    const response = await MostrarKardex(p);
    set({ parametros: p });
    set({ datakardex: response });
    return response;
  },

  buscarKardex: async (p) => {
    const response = await BuscarKardex(p);
    set({ datakardex: response });
    return response;
  },
}));