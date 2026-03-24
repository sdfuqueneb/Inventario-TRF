import { create } from "zustand";
import { MostrarEmpresa } from "../supabase/crudEmpresa";

export const useEmpresaStore = create ((set, get) => ({
    dataempresa: [],
    mostrarEmpresa: async (p) => {
        const response = await MostrarEmpresa(p);
        set({ dataempresa: response });
        return response;
    }
}))