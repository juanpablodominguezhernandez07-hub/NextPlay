"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatBadge from "@/components/StatBadge";
import { useAuth } from "@/lib/auth-context";
import { obtenerJugadorPorUserId } from "@/lib/store";
import { PerfilJugador } from "@/lib/types";

const CAMPOS_CLAVE: (keyof PerfilJugador)[] = [
  "nombreCompleto",
  "fotoUrl",
  "edad",
  "ciudadEstado",
  "escuela",
  "generacion",
  "alturaCm",
  "pesoKg",
  "equipoActual",
  "numeroJersey",
  "sobreMi"
];

function calcularCompletado(perfil: PerfilJugador): number {
  const llenos = CAMPOS_CLAVE.filter((campo) => {
    const valor = perfil[campo];
    return valor !== "" && valor !== 0 && valor !== undefined;
  }).length;
  const extra = (perfil.highlights.length > 0 ? 1 : 0) + (perfil.logros.length > 0 ? 1 : 0);
  const total = CAMPOS_CLAVE.length + 2;
  return Math.round(((llenos + extra) / total) * 100);
}

function JugadorDashboardContenido() {
  const { sesion } = useAuth();
  const [perfil, setPerfil] = useState<PerfilJugador | null>(null);

  useEffect(() => {
    if (!sesion) return;
    setPerfil(obtenerJugadorPorUserId(sesion.usuarioId) || null);
  }, [sesion]);

  if (!perfil) {
    return <div className="max-w-6xl mx-auto px-5 py-16">Cargando tu perfil…</div>;
  }

  const completado = calcularCompletado(perfil);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-display text-gold tracking-widest text-sm mb-1">DASHBOARD DE JUGADOR</p>
          <h1 className="font-display text-4xl">
            {perfil.nombreCompleto || "Completa tu nombre"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/jugador/perfil/editar" className="border border-stadium px-4 py-2 font-display tracking-wide hover:bg-stadium hover:text-chalk transition-colors">
            Editar perfil
          </Link>
          <Link href="/jugador/highlights" className="border border-stadium px-4 py-2 font-display tracking-wide hover:bg-stadium hover:text-chalk transition-colors">
            Subir highlight
          </Link>
          <Link href="/jugador/curriculum" className="border border-stadium px-4 py-2 font-display tracking-wide hover:bg-stadium hover:text-chalk transition-colors">
            Generar currículum
          </Link>
          {perfil.publicado && (
            <Link href={`/jugadores/${perfil.id}`} className="bg-turf text-chalk px-4 py-2 font-display tracking-wide hover:bg-turfdark transition-colors">
              Ver perfil público
            </Link>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 mb-12">
        <div className="bg-white p-6"><StatBadge valor={`${completado}%`} etiqueta="Perfil completado" /></div>
        <div className="bg-white p-6"><StatBadge valor={perfil.highlights.length} etiqueta="Videos de highlights" /></div>
        <div className="bg-white p-6"><StatBadge valor={perfil.visitasPerfil} etiqueta="Visitas al perfil" /></div>
        <div className="bg-white p-6"><StatBadge valor={perfil.publicado ? "Publicado" : "Borrador"} etiqueta="Estado del perfil" /></div>
      </div>

      {!perfil.publicado && (
        <div className="border border-gold bg-gold/10 px-5 py-4 mb-10">
          <p className="text-sm">
            Tu perfil todavía no es visible para coaches. Complétalo en{" "}
            <Link href="/jugador/perfil/editar" className="underline font-medium">Editar perfil</Link>{" "}
            y márcalo como publicado.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-black/10 p-6">
          <h2 className="font-display text-2xl mb-4">Highlights recientes</h2>
          {perfil.highlights.length === 0 ? (
            <p className="text-steel text-sm">Aún no has subido ningún highlight.</p>
          ) : (
            <ul className="space-y-3">
              {perfil.highlights.slice(0, 3).map((h) => (
                <li key={h.id} className="text-sm">
                  <span className="font-medium">{h.titulo}</span>
                  <span className="text-steel"> — temporada {h.temporada}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white border border-black/10 p-6">
          <h2 className="font-display text-2xl mb-4">Logros</h2>
          {perfil.logros.length === 0 ? (
            <p className="text-steel text-sm">Aún no has agregado logros.</p>
          ) : (
            <ul className="space-y-3">
              {perfil.logros.slice(0, 3).map((l) => (
                <li key={l.id} className="text-sm">
                  <span className="font-medium">{l.titulo}</span>
                  <span className="text-steel"> — {l.anio}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JugadorDashboardPage() {
  return (
    <ProtectedRoute tipoRequerido="jugador">
      <JugadorDashboardContenido />
    </ProtectedRoute>
  );
}
