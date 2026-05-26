import { create } from "zustand";
import { MostrarEmpresa, ContarUsuariosPorEmpresa } from "../supabase/crudEmpresa";

export const useEmpresaStore = create((set) => ({
    contadorusuarios: 0,
    dataempresa: null,
    mostrarEmpresa: async (p) => {
        const response = await MostrarEmpresa(p);
        set({ dataempresa: response.empresa });
        return response.empresa;
    },
    ContarUsuariosPorEmpresa: async (p) => {
        const response = await ContarUsuariosPorEmpresa(p);
        set({contadorusuarios: response});
        return response;
    }
}));