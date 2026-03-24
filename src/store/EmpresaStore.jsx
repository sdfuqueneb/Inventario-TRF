import { create } from "zustand";
import { MostrarEmpresa, ContarUsuariosPorEmpresa } from "../supabase/crudEmpresa";

export const useEmpresaStore = create((set) => ({
    contadorusuarios: 0,
    dataempresa: [],
    mostrarEmpresa: async (p) => {
        const response = await MostrarEmpresa(p);
        set({ dataempresa: response });
        return response;
    },
    ContarUsuariosPorEmpresa: async (p) => {
        const response = await ContarUsuariosPorEmpresa(p);
        set({contadorusuarios: response});
        return response;
    }
}));