import { createContext, useState } from "react";
import Layout from "../blocks/Layout";

export const GlobalContext = createContext()

export const GlobalProvider = ({children})=>{
    const [user,setUser]=useState(null)

    const checkUser =async ()=>{
        const user = await JSON.parse(localStorage.getItem('user'))
        setUser(user)
    }

    const value = {
        user,
        checkUser
    }
    return(
        <GlobalContext.Provider value={value}>
            <Layout>
                {children}
            </Layout>
        </GlobalContext.Provider>
    )
}