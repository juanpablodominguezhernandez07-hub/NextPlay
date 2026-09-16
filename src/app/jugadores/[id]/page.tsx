"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  obtenerJugadorPorId,
  registrarVisitaPerfil,
  obtenerCoachPorUserId,
  alternarFavorito,
  registrarVistoReciente
} from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { PerfilJugador } from "@/lib/types";

export default function PerfilJugadorPage() {
  const params = useParams<{ id: string }>();
  const { sesion } = useAuth();
  const [jugador, setJugador] = useState<PerfilJugador | null | undefined>(undefined);
  const [esFavorito, setEsFavorito] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const j = obtenerJugadorPorId(params.id);
    setJugador(j || null);
    if (j) {
      registrarVisitaPerfil(j.id);
      if (sesion?.tipo === "coach") {
        registrarVistoReciente(sesion.usuarioId, j.id);
        const coach = obtenerCoachPorUserId(sesion.usuarioId);
        setEsFavorito(!!coach?.favoritos.includes(j.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  function copiarEnlace() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  function toggleFavorito() {
    if (!sesion || sesion.tipo !== "coach" || !jugador) return;
    alternarFavorito(sesion.usuarioId, jugador.id);
    setEsFavorito((v) => !v);
  }

  if (jugador === undefined) {
    return <div className="max-w-5xl mx-auto px-5 py-16">Cargando perfil…</div>;
  }

  if (jugador === null) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-3xl mb-3">Perfil no encontrado</h1>
        <Link href="/explorar" className="text-turf underline">Volver a Explorar</Link>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-stadium text-chalk">
        <div className="max-w-5xl mx-auto px-5 py-12 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 shrink-0 bg-white/10 overflow-hidden">
            {jugador.fotoUrl && (
              <img src={jugador.fotoUrl} alt={jugador.nombreCompleto} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-display text-gold tracking-widest text-sm mb-1">
              {jugador.posicion} · GEN {jugador.generacion}
            </p>
            <h1 className="font-display text-4xl mb-2">{jugador.nombreCompleto}</h1>
            <p className="text-steel mb-4">
              {jugador.escuela} · {jugador.ciudadEstado} · {jugador.alturaCm} cm · {jugador.pesoKg} kg
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#highlights" className="bg-turf hover:bg-turfdark transition-colors px-4 py-2 font-display tracking-wide">
                Ver highlights
              </a>
              <button onClick={copiarEnlace} className="border border-chalk/40 hover:border-gold px-4 py-2 font-display tracking-wide">
                {copiado ? "¡Enlace copiado!" : "Compartir perfil"}
              </button>
              <a href={`mailto:${jugador.emailContacto}`} className="border border-chalk/40 hover:border-gold px-4 py-2 font-display tracking-wide">
                Contactar
              </a>
              {sesion?.tipo === "coach" && (
                <button
                  onClick={toggleFavorito}
                  className={`px-4 py-2 font-display tracking-wide border ${esFavorito ? "bg-gold text-stadium border-gold" : "border-chalk/40 hover:border-gold"}`}
                >
                  {esFavorito ? "En favoritos ✓" : "Guardar como favorito"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-5 py-12 space-y-12">
        {jugador.sobreMi && (
          <section>
            <h2 className="font-display text-2xl mb-3">Sobre mí</h2>
            <p className="text-steel">{jugador.sobreMi}</p>
          </section>
        )}

        <section>
          <h2 className="font-display text-2xl mb-3">Información deportiva</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <Dato etiqueta="Equipo actual" valor={jugador.equipoActual} />
            <Dato etiqueta="Número de jersey" valor={jugador.numeroJersey} />
            <Dato etiqueta="Mano dominante" valor={jugador.manoDominante} />
            {jugador.gpa && <Dato etiqueta="GPA" valor={jugador.gpa} />}
          </div>
        </section>

        {jugador.estadisticas.length > 0 && (
          <section>
            <h2 className="font-display text-2xl mb-3">Estadísticas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white border border-black/10">
                <thead>
                  <tr className="text-left bg-stadium text-chalk">
                    <th className="py-2 px-3">Temporada</th>
                    <th className="py-2 px-3">Yardas</th>
                    <th className="py-2 px-3">TDs</th>
                    <th className="py-2 px-3">Tackleos</th>
                    <th className="py-2 px-3">INTs</th>
                    <th className="py-2 px-3">Sacks</th>
                  </tr>
                </thead>
                <tbody>
                  {jugador.estadisticas.map((e, i) => (
                    <tr key={i} className="border-t border-black/10">
                      <td className="py-2 px-3">{e.temporada}</td>
                      <td className="py-2 px-3">{e.yardas ?? "—"}</td>
                      <td className="py-2 px-3">{e.touchdowns ?? "—"}</td>
                      <td className="py-2 px-3">{e.tackleos ?? "—"}</td>
                      <td className="py-2 px-3">{e.intercepciones ?? "—"}</td>
                      <td className="py-2 px-3">{e.sacks ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {jugador.experiencia.length > 0 && (
          <section>
            <h2 className="font-display text-2xl mb-3">Experiencia</h2>
            <ul className="space-y-2 text-sm">
              {jugador.experiencia.map((e) => (
                <li key={e.id} className="bg-white border border-black/10 p-4">
                  <p className="font-medium">{e.equipo} — {e.rol}</p>
                  <p className="text-steel">{e.temporada}</p>
                  {e.descripcion && <p className="text-steel mt-1">{e.descripcion}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {jugador.logros.length > 0 && (
          <section>
            <h2 className="font-display text-2xl mb-3">Logros</h2>
            <ul className="space-y-2 text-sm">
              {jugador.logros.map((l) => (
                <li key={l.id} className="bg-white border border-black/10 p-4">
                  <p className="font-medium">{l.titulo}</p>
                  <p className="text-steel">{l.tipo} · {l.anio}</p>
                  {l.descripcion && <p className="text-steel mt-1">{l.descripcion}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="highlights">
          <h2 className="font-display text-2xl mb-3">Highlights y videos</h2>
          {jugador.highlights.length === 0 ? (
            <p className="text-steel text-sm">Este jugador aún no ha subido highlights.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {jugador.highlights.map((h) => (
                <a
                  key={h.id}
                  href={h.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-black/10 block"
                >
                  <img src={h.miniatura} alt={h.titulo} className="w-full aspect-video object-cover" />
                  <div className="p-4">
                    <h3 className="font-display text-lg">{h.titulo}</h3>
                    <p className="text-sm text-steel">{h.descripcion}</p>
                    <p className="text-xs text-steel mt-1">Temporada {h.temporada} · {h.posicion}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-2xl mb-3">Información académica</h2>
          <p className="text-steel text-sm">{jugador.escuela} · Generación {jugador.generacion}{jugador.gpa ? ` · GPA ${jugador.gpa}` : ""}</p>
        </section>

        <section>
          <h2 className="font-display text-2xl mb-3">Redes sociales</h2>
          <p className="text-steel text-sm">
            {[jugador.instagram, jugador.twitter, jugador.hudl].filter(Boolean).join(" · ") || "No agregadas"}
          </p>
        </section>
      </div>
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="bg-white border border-black/10 p-4">
      <p className="text-xs uppercase tracking-wider text-steel mb-1">{etiqueta}</p>
      <p className="font-medium">{valor || "—"}</p>
    </div>
  );
}
