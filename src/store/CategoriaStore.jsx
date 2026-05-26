import { create } from "zustand";
import { BuscarCategoria, EditarCategoria, EliminarCategoria, InsertarCategoria, MostrarCategoria } from "../supabase/crudCategoria";

export const useCategoriaStore = create((set, get) => ({
    buscador: "",
    setBuscador: (p) => {set({ buscador: p })},
    dataCategoria: [],
    CategoriaItemSelect: [],
    parametros: {},
    setCategoriaItemSelect: (item) => set({ CategoriaItemSelect: item }),
    mostrarCategoria: async (p) => {
    const response = await MostrarCategoria(p);
    set({ parametros: p });
    set({ dataCategoria: response });
    set({ CategoriaItemSelect: response[0] });
    return response;                   
    },
    InsertarCategoria: async (p) => {
        await InsertarCategoria(p);
        const { mostrarCategoria } = get(); 
        const { parametros } = get();
        await mostrarCategoria(parametros);    
    },
    eliminarCategoria: async (p) => {
        await EliminarCategoria(p);
        const { mostrarCategoria } = get();   
        const { parametros } = get();
        await mostrarCategoria(parametros);   
    },
    editarCategoria: async (p) => {
        await EditarCategoria(p);
        const { mostrarCategoria } = get();   
        const { parametros } = get();
        await mostrarCategoria(parametros);   
    },
    buscarCategoria: async (p) => {
        const response = await BuscarCategoria(p);
        set({dataCategoria: response});
        return response ?? [];
    }
 }));