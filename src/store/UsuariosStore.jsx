import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";
import { InsertarUsuarios } from "../supabase/crudUsuarios";

export const useUsuariosStore = create ((set, get) => ({
    insertarUsuarioAdmin: async (p) => {
        const { data, error } = await supabase.auth.signUp({
            email: p.email,
            password: p.password
        });
        if (error) {
            console.log("Error Supabase:", error.message);
            return null;
        }
        console.log ("Datos del usuario autenticado registrado ", data);
        const datauser = await InsertarUsuarios ({idauth: data.user.id, fecha_registro: new Date(), tipo_usuario: "admin"});
        return datauser;
    }
}))