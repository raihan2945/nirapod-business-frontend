"use client"

import { ReactNode, createContext, useContext, useState } from "react";


const SideNavContext = createContext<any>(null)

export const SideNavContextProvider = ({children}: {children: ReactNode}) => {
    
    const [active, setActive] = useState<boolean>(true)
    const [activeNav, setActiveNav] = useState('')

    return (
        <SideNavContext.Provider value={{
            active,
            activeNav,
            setActiveNav,
            setActive
        }}>
            {children}
        </SideNavContext.Provider>
    )
}

export const useSideNavContext = () => useContext(SideNavContext)