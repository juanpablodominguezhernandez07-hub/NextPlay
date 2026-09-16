"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { obtenerJugadorPorUserId } from "@/lib/store";
import { PerfilJugador } from "@/lib/types";

function CurriculumContenido() {
  const { sesion } = useAuth();
  const [perfil, setPerfil] = useState<PerfilJugador | null>(null);
  const [generado, setGenerado] = useState(false);

  useEffect(() => {
    if (!sesion) return;
    setPerfil(obtenerJugadorPorUserId(sesion.usuarioId) || null);
  }, [sesion]);

  if (!perfil) return <div className="max-w-4xl mx-auto px-5 py-16">Cargando…</div>;

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 print:hidden">
        <h1 className="font-display text-4xl">Currículum deportivo</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setGenerado(true)}
            className="bg-turf hover:bg-turfdark transition-colors text-chalk px-5 py-3 font-display tracking-wide"
          >
            Generar currículum
          </button>
          {generado && (
            <button
              onClick={() => window.print()}
              className="border border-stadium px-5 py-3 font-display tracking-wide hover:bg-stadium hover:text-chalk transition-colors"
            >
              Descargar como PDF
            </button>
          )}
        </div>
      </div>

      {!generado && (
        <p className="text-steel print:hidden">
          Presiona "Generar currículum" para construir una versión visual y
          profesional a partir de la información de tu perfil. Después podrás
          descargarlo como PDF usando el diálogo de impresión de tu navegador.
        </p>
      )}

      {generado && (
        <div className="bg-white border border-black/10 p-10 print:border-0 print:p-0">
          <header className="flex items-start justify-between border-b-4 border-gold pb-6 mb-6">
            <div>
              <h2 className="font-display text-4xl">{perfil.nombreCompleto || "Nombre del jugador"}</h2>
              <p className="text-steel">
                {perfil.posicion} · {perfil.escuela} · Generación {perfil.generacion}
              </p>
              <p className="text-steel text-sm">
                {perfil.ciudadEstado} · {perfil.emailContacto} {perfil.telefono ? `· ${perfil.telefono}` : ""}
              </p>
            </div>
            <div className="text-right text-sm text-steel shrink-0">
              <p>{perfil.alturaCm} cm / {perfil.pesoKg} kg</p>
              <p>Mano dominante: {perfil.manoDominante}</p>
              <p>Jersey #{perfil.numeroJersey}</p>
              {perfil.gpa && <p>GPA: {perfil.gpa}</p>}
            </div>
          </header>

          {perfil.sobreMi && (
            <section className="mb-6">
              <h3 className="font-display text-xl border-b border-black/10 mb-2 pb-1">Sobre el jugador</h3>
              <p className="text-sm">{perfil.sobreMi}</p>
            </section>
          )}

          {perfil.objetivosDeportivos && (
            <section className="mb-6">
              <h3 className="font-display text-xl border-b border-black/10 mb-2 pb-1">Objetivos deportivos</h3>
              <p className="text-sm">{perfil.objetivosDeportivos}</p>
            </section>
          )}

          {perfil.experiencia.length > 0 && (
            <section className="mb-6">
              <h3 className="font-display text-xl border-b border-black/10 mb-2 pb-1">Experiencia / equipos anteriores</h3>
              <ul className="text-sm space-y-1">
                {perfil.experiencia.map((e) => (
                  <li key={e.id}>
                    <span className="font-medium">{e.equipo}</span> — {e.rol} ({e.temporada})
                    {e.descripcion && <span className="text-steel"> · {e.descripcion}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {perfil.estadisticas.length > 0 && (
            <section className="mb-6">
              <h3 className="font-display text-xl border-b border-black/10 mb-2 pb-1">Estadísticas</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-steel">
                    <th className="py-1">Temporada</th>
                    <th className="py-1">Yardas</th>
                    <th className="py-1">TDs</th>
                    <th className="py-1">Tackleos</th>
                    <th className="py-1">INTs</th>
                    <th className="py-1">Sacks</th>
                  </tr>
                </thead>
                <tbody>
                  {perfil.estadisticas.map((e, i) => (
                    <tr key={i} className="border-t border-black/10">
                      <td className="py-1">{e.temporada}</td>
                      <td className="py-1">{e.yardas ?? "—"}</td>
                      <td className="py-1">{e.touchdowns ?? "—"}</td>
                      <td className="py-1">{e.tackleos ?? "—"}</td>
                      <td className="py-1">{e.intercepciones ?? "—"}</td>
                      <td className="py-1">{e.sacks ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {perfil.logros.length > 0 && (
            <section className="mb-6">
              <h3 className="font-display text-xl border-b border-black/10 mb-2 pb-1">Campeonatos, premios y reconocimientos</h3>
              <ul className="text-sm space-y-1">
                {perfil.logros.map((l) => (
                  <li key={l.id}>
                    <span className="font-medium">{l.titulo}</span> — {l.tipo} ({l.anio})
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3 className="font-display text-xl border-b border-black/10 mb-2 pb-1">Redes y enlaces</h3>
            <p className="text-sm text-steel">
              {[perfil.instagram, perfil.twitter, perfil.hudl].filter(Boolean).join(" · ") || "No agregadas"}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

export default function CurriculumPage() {
  return (
    <ProtectedRoute tipoRequerido="jugador">
      <CurriculumContenido />
    </ProtectedRoute>
  );
}
