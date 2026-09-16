"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { obtenerJugadorPorUserId, agregarHighlight, eliminarHighlight } from "@/lib/store";
import { PerfilJugador, Highlight, Posicion } from "@/lib/types";

const POSICIONES: Posicion[] = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"];

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function extraerIdYoutube(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{6,})/);
  return match ? match[1] : null;
}

function HighlightsContenido() {
  const { sesion } = useAuth();
  const [perfil, setPerfil] = useState<PerfilJugador | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [temporada, setTemporada] = useState("");
  const [posicion, setPosicion] = useState<Posicion>("QB");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");

  function cargar() {
    if (!sesion) return;
    setPerfil(obtenerJugadorPorUserId(sesion.usuarioId) || null);
  }

  useEffect(cargar, [sesion]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!perfil) return;
    const idYt = extraerIdYoutube(youtubeUrl);
    if (!idYt) {
      setError("Pega un enlace válido de YouTube (por ejemplo https://www.youtube.com/watch?v=...).");
      return;
    }
    const highlight: Highlight = {
      id: uuid(),
      jugadorId: perfil.id,
      titulo,
      descripcion,
      temporada,
      posicion,
      youtubeUrl,
      miniatura: `https://img.youtube.com/vi/${idYt}/hqdefault.jpg`,
      creadoEn: new Date().toISOString()
    };
    agregarHighlight(perfil.id, highlight);
    setTitulo("");
    setDescripcion("");
    setTemporada("");
    setYoutubeUrl("");
    cargar();
  }

  function eliminar(id: string) {
    if (!perfil) return;
    eliminarHighlight(perfil.id, id);
    cargar();
  }

  if (!perfil) return <div className="max-w-3xl mx-auto px-5 py-16">Cargando…</div>;

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="font-display text-4xl mb-2">Mis highlights</h1>
      <p className="text-steel mb-8">
        Agrega tus mejores jugadas usando un enlace de YouTube. Más adelante podrás
        subir el archivo de video directamente cuando conectes almacenamiento
        (Supabase Storage o Firebase Storage).
      </p>

      <form onSubmit={onSubmit} className="bg-white border border-black/10 p-6 space-y-4 mb-10">
        <h2 className="font-display text-2xl">Agregar nuevo highlight</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input required value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full border border-black/20 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="w-full border border-black/20 px-3 py-2" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Temporada</label>
            <input required value={temporada} onChange={(e) => setTemporada(e.target.value)} placeholder="Ej. 2025" className="w-full border border-black/20 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Posición</label>
            <select value={posicion} onChange={(e) => setPosicion(e.target.value as Posicion)} className="w-full border border-black/20 px-3 py-2">
              {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Enlace de YouTube</label>
          <input required value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full border border-black/20 px-3 py-2" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="bg-turf hover:bg-turfdark transition-colors text-chalk px-6 py-3 font-display text-lg tracking-wide">
          Agregar highlight
        </button>
      </form>

      <h2 className="font-display text-2xl mb-4">Videos subidos ({perfil.highlights.length})</h2>
      {perfil.highlights.length === 0 ? (
        <p className="text-steel text-sm">Aún no has subido ningún highlight.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {perfil.highlights.map((h) => (
            <div key={h.id} className="bg-white border border-black/10">
              <a href={h.youtubeUrl} target="_blank" rel="noreferrer">
                <img src={h.miniatura} alt={h.titulo} className="w-full aspect-video object-cover" />
              </a>
              <div className="p-4 space-y-1">
                <h3 className="font-display text-lg">{h.titulo}</h3>
                <p className="text-sm text-steel">{h.descripcion}</p>
                <p className="text-xs text-steel">Temporada {h.temporada} · {h.posicion}</p>
                <button onClick={() => eliminar(h.id)} className="text-sm text-red-600 mt-2">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HighlightsPage() {
  return (
    <ProtectedRoute tipoRequerido="jugador">
      <HighlightsContenido />
    </ProtectedRoute>
  );
}
