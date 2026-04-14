"use client";
import { createContext, useContext, useState, useEffect } from "react";



type GlobalContextType = {
    SMVisible: boolean;
    setSMVisible: (value: boolean) => void;
    SBvisible: boolean;
    setSBVisible: (value: boolean) => void;
    isMobile: boolean;
    setIsMobile: (value: boolean) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [SMVisible, setSMVisible] = useState(false);
    const [SBvisible, setSBVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false); 


    useEffect(()=>{
        if (!isMobile){
            const handleResize = ()=>{
                setIsMobile(window.innerWidth < 768);
            }
            handleResize();
            window.addEventListener("resize", handleResize);

            return ()=> window.removeEventListener("resize", handleResize);
        }
    },[]);
  


    return (
        <GlobalContext.Provider value={{ SMVisible, setSMVisible, SBvisible, setSBVisible, isMobile, setIsMobile }}>
        {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within GlobalProvider");
  return context;
};
