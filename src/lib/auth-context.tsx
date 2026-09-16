"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SesionActual } from "./types";
import { obtenerSesion, cerrarSesion as cerrarSesionStore, asegurarSeed } from "./store";

interface AuthContextValue {
  sesion: SesionActual | null;
  cargando: boolean;
  refrescar: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  sesion: null,
  cargando: true,
  refrescar: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<SesionActual | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  const refrescar = () => {
    setSesion(obtenerSesion());
  };

  useEffect(() => {
    asegurarSeed();
    refrescar();
    setCargando(false);
  }, []);

  const logout = () => {
    cerrarSesionStore();
    setSesion(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ sesion, cargando, refrescar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
