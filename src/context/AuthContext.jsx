import { createContext, useContext, useEffect, useState, useMemo  } from "react";
import { supabase } from "../supabase/supabase.config";

const AuthContext = createContext();

export const AuthContextProvider= ({children}) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const {data:authListener} = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log(event, session)
                if(session?.user==null){
                    setUser(null)
                } else {
                    setUser(session?.user)
                }
            }
        );
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [])
    const value = useMemo(() => ({ user }), [user]); 
    
    return(
        <AuthContext.Provider value={value}> 
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () =>{
    return useContext(AuthContext);
}
