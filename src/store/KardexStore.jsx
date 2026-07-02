import { create } from "zustand";
import { BuscarKardex, EditarKardex, EliminarKardex, InsertarKardex, MostrarKardex } from "../supabase/crudKardex";
import { supabase } from "../supabase/supabase.config";

export const useKardexStore = create((set, get) => ({
    buscador: "",
    setBuscador: (p) => {set({ buscador: p })},
    dataKardex: [],
    KardexItemSelect: [],
    parametros: {},
    setKardexItemSelect: (item) => set({ KardexItemSelect: item }),
    mostrarKardex: async (p) => {
    const { data, error } = await supabase
            .from("Kardex")
            .select("*")
            .eq("id_empresa", p.id_empresa)
            .order("id", { ascending: true });

        if (error) return [];
        set({ dataKardex: data ?? [] });
        return data;               
    },
    InsertarKardex: async (p) => {
        await InsertarKardex(p);
        const { mostrarKardex } = get(); 
        const { parametros } = get();
        await mostrarKardex(parametros);    
    },
    eliminarKardex: async (p) => {
        await EliminarKardex(p);
        const { mostrarKardex } = get();   
        const { parametros } = get();
        await mostrarKardex(parametros);   
    },
    editarKardex: async (p) => {
        await EditarKardex(p);
        const { mostrarKardex } = get();   
        const { parametros } = get();
        await mostrarKardex(parametros);   
    },
    buscarKardex: async (p) => {
        const response = await BuscarKardex(p);
        set({dataKardex: response});
        return response ?? [];
    }
 }));