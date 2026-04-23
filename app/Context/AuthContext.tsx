"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { Direccion } from "../Elements/interface";

type User = {
  internal_id: number;
  name: string;
  lastname: string;
  email: string;
  level: number;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  direccionEnv: Direccion;
  setDireccionContext: (direccionData:Direccion)=>void;
  URL: string;
  logoutConfirmed: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [direccionEnv, setDireccionEnv] = useState<Direccion>({} as Direccion);
  const [logoutConfirmed, setLogoutConfirmed] = useState(false);

  


  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedDireccioon = localStorage.getItem("direccion_env");
    if(savedDireccioon) setDireccionEnv(JSON.parse(savedDireccioon));
  }, []);

  const setDireccionContext = (direccionData: Direccion)=>{
    setDireccionEnv(direccionData);
    localStorage.setItem('direccion_env', JSON.stringify(direccionData));
  }

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    const cerrar = confirm("Seguro que desa cerrar la sesion actual?");
    if (!cerrar) return;
    setUser(null);
    localStorage.removeItem("user");
    setLogoutConfirmed(true);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, URL, direccionEnv, setDireccionContext, logoutConfirmed }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
export const URL = "https://api.raqmarmx.com";
