"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { TipoUsuario } from "@/lib/types";

export default function ProtectedRoute({
  tipoRequerido,
  children
}: {
  tipoRequerido: TipoUsuario;
  children: ReactNode;
}) {
  const { sesion, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;
    if (!sesion) {
      router.replace("/login");
      return;
    }
    if (sesion.tipo !== tipoRequerido) {
      router.replace(sesion.tipo === "jugador" ? "/jugador/dashboard" : "/coach/dashboard");
    }
  }, [sesion, cargando, tipoRequerido, router]);

  if (cargando || !sesion || sesion.tipo !== tipoRequerido) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-24 text-center text-steel">
        Verificando sesión…
      </div>
    );
  }

  return <>{children}</>;
}
