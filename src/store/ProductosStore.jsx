import { create } from "zustand";
import { BuscarProductos, EditarProductos, EliminarProductos, InsertarProductos, MostrarProductos } from "../supabase/crudProductos";

export const useProductosStore = create((set, get) => ({
    buscador: "",
    setBuscador: (p) => {set({ buscador: p })},
    dataProductos: [],
    ProductosItemSelect: [],
    parametros: {},
    mostrarProductos: async (p) => {
    const response = await MostrarProductos(p);
    set({ parametros: p });
    set({ dataProductos: response });
    set({ ProductosItemSelect: response[0] });
    return response;                   
    },
    InsertarProductos: async (p) => {
        await InsertarProductos(p);
        const { mostrarProductos } = get(); 
        const { parametros } = get();
        await mostrarProductos(parametros);    
    },
    eliminarProductos: async (p) => {
        await EliminarProductos(p);
        const { mostrarProductos } = get();   
        const { parametros } = get();
        await mostrarProductos(parametros);   
    },
    editarProductos: async (p) => {
        await EditarProductos(p);
        const { mostrarProductos } = get();   
        const { parametros } = get();
        await mostrarProductos(parametros);   
    },
    buscarProductos: async (p) => {
        const response = await BuscarProductos(p);
        set({dataProductos: response});
        return response ?? [];
    }
 }));