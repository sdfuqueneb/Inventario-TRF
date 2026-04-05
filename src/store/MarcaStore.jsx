import { create } from "zustand";
import { BuscarMarca, EditarMarca, EliminarMarca, InsertarMarca, MostrarMarca } from "../supabase/crudMarca";

export const useMarcaStore = create((set, get) => ({
    buscador: "",
    setBuscador: (p) => {set({ buscador: p })},
    datamarca: [],
    marcaItemSelect: [],
    parametros: {},
    mostrarMarca: async (p) => {
    const response = await MostrarMarca(p);
    set({ parametros: p });
    set({ datamarca: response });
    set({ marcaItemSelect: response[0] });
    return response;                   
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
    }
 }));