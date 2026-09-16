"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { sesion, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const dashboardHref =
    sesion?.tipo === "jugador" ? "/jugador/dashboard" : "/coach/dashboard";

  return (
    <header className="sticky top-0 z-40 bg-stadium text-chalk">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 bg-gold" aria-hidden="true" />
            <span className="font-display text-2xl tracking-wide font-semibold">
              NEXTPLAY
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 font-display text-lg tracking-wide">
            <Link href="/explorar" className="hover:text-gold transition-colors">
              Explorar jugadores
            </Link>
            {sesion ? (
              <>
                <Link href={dashboardHref} className="hover:text-gold transition-colors">
                  Mi dashboard
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-gold transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gold transition-colors">
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro/jugador"
                  className="bg-turf hover:bg-turfdark transition-colors px-4 py-2 text-chalk"
                >
                  Crear mi perfil
                </Link>
              </>
            )}
          </nav>

          <button
            className="md:hidden p-2"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((v) => !v)}
          >
            <span className="block w-6 h-0.5 bg-chalk mb-1.5" />
            <span className="block w-6 h-0.5 bg-chalk mb-1.5" />
            <span className="block w-6 h-0.5 bg-chalk" />
          </button>
        </div>

        {menuAbierto && (
          <nav className="md:hidden pb-5 flex flex-col gap-4 font-display text-lg tracking-wide">
            <Link href="/explorar" onClick={() => setMenuAbierto(false)}>
              Explorar jugadores
            </Link>
            {sesion ? (
              <>
                <Link href={dashboardHref} onClick={() => setMenuAbierto(false)}>
                  Mi dashboard
                </Link>
                <button
                  className="text-left"
                  onClick={() => {
                    setMenuAbierto(false);
                    logout();
                  }}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuAbierto(false)}>
                  Iniciar sesión
                </Link>
                <Link href="/registro/jugador" onClick={() => setMenuAbierto(false)}>
                  Crear mi perfil
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
      <div className="h-1 bg-gold" />
    </header>
  );
}
