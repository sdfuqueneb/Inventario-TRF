import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../supabase/supabase.config";

const AuthContext = createContext();

export const AuthContextProvider= ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const obtenerSesionInicial = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                }
            } catch (error) {
                console.error("Error recuperando sesión inicial:", error);
            } finally {
                setLoading(false); 
            }
        };

        obtenerSesionInicial();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log("Evento Auth:", event, session);
                if (session?.user == null) {
                    setUser(null);
                } else {
                    setUser(session.user);
                }
                setLoading(false); 
            }
        );
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const value = useMemo(() => ({ user, loading }), [user, loading]); 

    if (loading) {
        return (
            <div style={{
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                background: '#131313', 
                color: '#2EC971',
                fontFamily: 'sans-serif'
            }}>
                <h3>Verificando sesión segura...</h3>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () =>{
    return useContext(AuthContext);
};
