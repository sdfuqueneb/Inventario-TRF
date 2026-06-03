import { supabase } from "./supabase.config"
import Swal from "sweetalert2"

export async function InsertarProductos(p) {
    const { error } = await supabase
        .from("productos")
        .insert([
            {
                codigobarras: p.codigobarras,
                descripcion: p.descripcion,
                id_categoria: p.id_categoria,
                id_empresa: p.id_empresa,
                id_marca: p.id_marca,
                modelo: p.modelo, 
                placa: p.placa,
                preciocompra: p.preciocompra,
                stock: p.stock,
                stock_minimo: p.stock_minimo,
            }
        ]);

    if (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
            footer: 'Revise que los datos no estén duplicados o que existan las llaves foráneas',
        });
        throw error;
    }
}

export async function MostrarProductos(p) {
    const { data, error } = await supabase
        .from("productos")
        .select(`
            id,
            descripcion,
            modelo,
            id_marca,
            stock,
            stock_minimo,
            codigobarras,
            placa,
            preciocompra,
            id_categoria,
            id_empresa,
            marca:id_marca ( descripcion ),
            categorias:id_categoria ( descripcion, color )
        `)
        .eq("id_empresa", p.id_empresa)
        .order("id", { ascending: true });

    if (error) {
        console.error("Error al mostrar productos:", error.message);
        return [];
    }

    return (data ?? []).map((prod) => ({
        ...prod,
        marca: prod.marca?.descripcion || "",
        categoria: prod.categorias?.descripcion || "",
        color: prod.categorias?.color || ""
    }));
}

export async function EliminarProductos(p) {
    const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", p.id);

    if (error) {
        alert("Error al eliminar: " + error.message);
    }
}

export async function EditarProductos(p) {
    const { error } = await supabase
        .from("productos")
        .update(p)
        .eq("id", p.id);

    if (error) {
        alert("Error al editar Productos: " + error.message);
    }
}

export async function BuscarProductos(p) {
    const { data, error } = await supabase
        .from("productos")
        .select(`
            id,
            descripcion,
            modelo,
            id_marca,
            stock,
            stock_minimo,
            codigobarras,
            placa,
            preciocompra,
            id_categoria,
            id_empresa,
            marca:id_marca ( descripcion ),
            categorias:id_categoria ( descripcion, color )
        `)
        .eq("id_empresa", p.id_empresa)
        .ilike("descripcion", "%" + p.descripcion + "%");

    if (error) {
        console.error("Error al buscar productos:", error.message);
        return [];
    }

    return (data ?? []).map((prod) => ({
        ...prod,
        marca: prod.marca?.descripcion || "",
        categoria: prod.categorias?.descripcion || "",
        color: prod.categorias?.color || ""
    }));
}