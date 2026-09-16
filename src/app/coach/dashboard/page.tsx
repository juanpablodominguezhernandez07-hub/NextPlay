"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import PlayerCard from "@/components/PlayerCard";
import { useAuth } from "@/lib/auth-context";
import { obtenerCoachPorUserId, listarJugadores } from "@/lib/store";
import { PerfilCoach, PerfilJugador } from "@/lib/types";

function CoachDashboardContenido() {
  const { sesion } = useAuth();
  const [coach, setCoach] = useState<PerfilCoach | null>(null);
  const [jugadores, setJugadores] = useState<PerfilJugador[]>([]);

  useEffect(() => {
    if (!sesion) return;
    const c = obtenerCoachPorUserId(sesion.usuarioId) || null;
    setCoach(c);
    setJugadores(listarJugadores());
  }, [sesion]);

  if (!coach) return <div className="max-w-6xl mx-auto px-5 py-16">Cargando…</div>;

  const favoritos = jugadores.filter((j) => coach.favoritos.includes(j.id));
  const vistos = coach.vistosRecientes
    .map((id) => jugadores.find((j) => j.id === id))
    .filter((j): j is PerfilJugador => !!j);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-display text-gold tracking-widest text-sm mb-1">DASHBOARD DE COACH</p>
          <h1 className="font-display text-4xl">Bienvenido, reclutador</h1>
        </div>
        <Link href="/explorar" className="bg-turf hover:bg-turfdark transition-colors text-chalk px-5 py-3 font-display tracking-wide">
          Explorar jugadores
        </Link>
      </div>

      <section className="mb-14">
        <h2 className="font-display text-2xl mb-4">Jugadores guardados ({favoritos.length})</h2>
        {favoritos.length === 0 ? (
          <p className="text-steel text-sm">Aún no has guardado jugadores como favoritos.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((j) => <PlayerCard key={j.id} jugador={j} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl mb-4">Vistos recientemente</h2>
        {vistos.length === 0 ? (
          <p className="text-steel text-sm">Aún no has visto ningún perfil de jugador.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vistos.map((j) => <PlayerCard key={j.id} jugador={j} />)}
          </div>
        )}
      </section>
    </div>
  );
}

export default function CoachDashboardPage() {
  return (
    <ProtectedRoute tipoRequerido="coach">
      <CoachDashboardContenido />
    </ProtectedRoute>
  );
}
