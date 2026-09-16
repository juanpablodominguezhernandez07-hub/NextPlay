"use client";

import { useEffect, useMemo, useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import { filtrarJugadores, FiltrosExplorar } from "@/lib/store";
import { PerfilJugador, Posicion } from "@/lib/types";

const POSICIONES: Posicion[] = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"];

export default function ExplorarPage() {
  const [filtros, setFiltros] = useState<FiltrosExplorar>({});
  const [jugadores, setJugadores] = useState<PerfilJugador[]>([]);

  useEffect(() => {
    setJugadores(filtrarJugadores(filtros));
  }, [filtros]);

  const generaciones = useMemo(
    () => Array.from(new Set(filtrarJugadores({}).map((j) => j.generacion))).sort(),
    []
  );

  function actualizar<K extends keyof FiltrosExplorar>(campo: K, valor: FiltrosExplorar[K]) {
    setFiltros((prev) => ({ ...prev, [campo]: valor || undefined }));
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-display text-4xl mb-2">Explorar jugadores</h1>
      <p className="text-steel mb-8">
        Busca y filtra jugadores publicados en NextPlay por posición, ubicación, escuela y más.
      </p>

      <div className="bg-white border border-black/10 p-5 mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium mb-1">Buscar por nombre</label>
          <input
            value={filtros.texto || ""}
            onChange={(e) => actualizar("texto", e.target.value)}
            placeholder="Ej. Juan Pérez"
            className="w-full border border-black/20 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Posición</label>
          <select
            value={filtros.posicion || ""}
            onChange={(e) => actualizar("posicion", e.target.value)}
            className="w-full border border-black/20 px-3 py-2"
          >
            <option value="">Todas</option>
            {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Generación</label>
          <select
            value={filtros.generacion || ""}
            onChange={(e) => actualizar("generacion", e.target.value)}
            className="w-full border border-black/20 px-3 py-2"
          >
            <option value="">Todas</option>
            {generaciones.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado / Ciudad</label>
          <input
            value={filtros.estado || ""}
            onChange={(e) => actualizar("estado", e.target.value)}
            placeholder="Ej. Querétaro"
            className="w-full border border-black/20 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Escuela</label>
          <input
            value={filtros.escuela || ""}
            onChange={(e) => actualizar("escuela", e.target.value)}
            className="w-full border border-black/20 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Altura mínima (cm)</label>
          <input
            type="number"
            value={filtros.alturaMinCm || ""}
            onChange={(e) => actualizar("alturaMinCm", Number(e.target.value) || undefined)}
            className="w-full border border-black/20 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Peso mínimo (kg)</label>
          <input
            type="number"
            value={filtros.pesoMinKg || ""}
            onChange={(e) => actualizar("pesoMinKg", Number(e.target.value) || undefined)}
            className="w-full border border-black/20 px-3 py-2"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setFiltros({})}
            className="text-sm underline text-steel"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <p className="text-sm text-steel mb-4">{jugadores.length} jugador(es) encontrados</p>

      {jugadores.length === 0 ? (
        <p className="text-steel">No hay jugadores que coincidan con esos filtros.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jugadores.map((j) => (
            <PlayerCard key={j.id} jugador={j} />
          ))}
        </div>
      )}
    </div>
  );
}
