import { create } from "zustand";
import { BuscarMarca, EditarMarca, EliminarMarca, InsertarMarca, MostrarMarca } from "../supabase/crudMarca";
import { supabase } from "../supabase/supabase.config";

export const useMarcaStore = create((set, get) => ({
    buscador: "",
    setBuscador: (p) => {set({ buscador: p })},
    datamarca: [],
    marcaItemSelect: [],
    parametros: {},
    setMarcaItemSelect: (item) => set({ marcaItemSelect: item }),
    mostrarMarca: async (p) => {
    const { data, error } = await supabase
            .from("marca")
            .select("*")
            .eq("id_empresa", p.id_empresa)
            .order("id", { ascending: true });

        if (error) return [];
        set({ datamarca: data ?? [] });
        return data;               
    },
    InsertarMarca: async (p) => {
        await InsertarMarca(p);
        const { mostrarMarca } = get(); 
        const { parametros } = get();
        await mostrarMarca(parametros);    
    },
    eliminarMarca: async (p) => {
        await EliminarMarca(p);
        const { mostrarMarca } = get();   
        const { parametros } = get();
        await mostrarMarca(parametros);   
    },
    editarMarca: async (p) => {
        await EditarMarca(p);
        const { mostrarMarca } = get();   
        const { parametros } = get();
        await mostrarMarca(parametros);   
    },
    buscarMarca: async (p) => {
        const response = await BuscarMarca(p);
        set({datamarca: response});
        return response ?? [];
    }
 }));