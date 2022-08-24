import { createContext, useState } from "react";
import Layout from "../blocks/Layout";

export const GlobalContext = createContext()

export const GlobalProvider = ({children})=>{
    const [user,setUser]=useState()

    const value = {
        user
    }
    return(
        <GlobalContext.Provider value={value}>
            <Layout>
                {children}
            </Layout>
        </GlobalContext.Provider>
    )
}