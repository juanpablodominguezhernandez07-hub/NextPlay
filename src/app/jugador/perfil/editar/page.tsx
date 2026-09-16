"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { obtenerJugadorPorUserId, guardarPerfilJugador } from "@/lib/store";
import { PerfilJugador, Posicion, ManoDominante, Logro, Experiencia, Estadisticas } from "@/lib/types";

const POSICIONES: Posicion[] = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"];
const MANOS: ManoDominante[] = ["Derecha", "Izquierda", "Ambidiestro"];

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function EditarPerfilContenido() {
  const { sesion } = useAuth();
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilJugador | null>(null);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (!sesion) return;
    const p = obtenerJugadorPorUserId(sesion.usuarioId);
    if (p) setPerfil(p);
  }, [sesion]);

  if (!perfil) {
    return <div className="max-w-3xl mx-auto px-5 py-16">Cargando…</div>;
  }

  function actualizar<K extends keyof PerfilJugador>(campo: K, valor: PerfilJugador[K]) {
    setPerfil((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  }

  function onFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => actualizar("fotoUrl", lector.result as string);
    lector.readAsDataURL(archivo);
  }

  function guardar(publicar?: boolean) {
    if (!perfil) return;
    const actualizado = publicar === undefined ? perfil : { ...perfil, publicado: publicar };
    guardarPerfilJugador(actualizado);
    setPerfil(actualizado);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  // --- Estadísticas ---
  function agregarEstadistica() {
    actualizar("estadisticas", [...perfil!.estadisticas, { temporada: "" }]);
  }
  function actualizarEstadistica(idx: number, campo: keyof Estadisticas, valor: string) {
    const copia = [...perfil!.estadisticas];
    copia[idx] = { ...copia[idx], [campo]: campo === "temporada" || campo === "otros" ? valor : Number(valor) || undefined };
    actualizar("estadisticas", copia);
  }
  function quitarEstadistica(idx: number) {
    actualizar("estadisticas", perfil.estadisticas.filter((_, i) => i !== idx));
  }

  // --- Logros ---
  function agregarLogro() {
    const nuevo: Logro = { id: uuid(), titulo: "", tipo: "Reconocimiento", anio: "" };
    actualizar("logros", [...perfil.logros, nuevo]);
  }
  function actualizarLogro(idx: number, campo: keyof Logro, valor: string) {
    const copia = [...perfil.logros];
    copia[idx] = { ...copia[idx], [campo]: valor } as Logro;
    actualizar("logros", copia);
  }
  function quitarLogro(idx: number) {
    actualizar("logros", perfil.logros.filter((_, i) => i !== idx));
  }

  // --- Experiencia ---
  function agregarExperiencia() {
    const nueva: Experiencia = { id: uuid(), equipo: "", temporada: "", rol: "" };
    actualizar("experiencia", [...perfil.experiencia, nueva]);
  }
  function actualizarExperiencia(idx: number, campo: keyof Experiencia, valor: string) {
    const copia = [...perfil.experiencia];
    copia[idx] = { ...copia[idx], [campo]: valor };
    actualizar("experiencia", copia);
  }
  function quitarExperiencia(idx: number) {
    actualizar("experiencia", perfil.experiencia.filter((_, i) => i !== idx));
  }

  const enlacePublico = typeof window !== "undefined" ? `${window.location.origin}/jugadores/${perfil.id}` : "";

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-4xl">Editar mi perfil</h1>
        <div className="flex gap-3">
          <Link href={`/jugadores/${perfil.id}`} className="text-sm underline text-steel">
            Ver cómo se ve públicamente
          </Link>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); guardar(); }} className="space-y-10">
        {/* Foto y datos generales */}
        <section className="bg-white border border-black/10 p-6 space-y-4">
          <h2 className="font-display text-2xl">Información general</h2>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-stadium overflow-hidden shrink-0">
              {perfil.fotoUrl && <img src={perfil.fotoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />}
            </div>
            <label className="text-sm">
              <span className="block mb-1 font-medium">Foto de perfil</span>
              <input type="file" accept="image/*" onChange={onFoto} />
            </label>
          </div>

          <Campo label="Nombre completo" value={perfil.nombreCompleto} onChange={(v) => actualizar("nombreCompleto", v)} required />
          <div className="grid sm:grid-cols-2 gap-4">
            <Campo label="Edad" type="number" value={String(perfil.edad || "")} onChange={(v) => actualizar("edad", Number(v) || 0)} />
            <Campo label="Ciudad / Estado" value={perfil.ciudadEstado} onChange={(v) => actualizar("ciudadEstado", v)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Campo label="Escuela" value={perfil.escuela} onChange={(v) => actualizar("escuela", v)} />
            <Campo label="Generación" value={perfil.generacion} onChange={(v) => actualizar("generacion", v)} placeholder="Ej. 2026" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Posición</label>
              <select
                value={perfil.posicion}
                onChange={(e) => actualizar("posicion", e.target.value as Posicion)}
                className="w-full border border-black/20 px-3 py-2"
              >
                {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mano dominante</label>
              <select
                value={perfil.manoDominante}
                onChange={(e) => actualizar("manoDominante", e.target.value as ManoDominante)}
                className="w-full border border-black/20 px-3 py-2"
              >
                {MANOS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Campo label="Altura (cm)" type="number" value={String(perfil.alturaCm || "")} onChange={(v) => actualizar("alturaCm", Number(v) || 0)} />
            <Campo label="Peso (kg)" type="number" value={String(perfil.pesoKg || "")} onChange={(v) => actualizar("pesoKg", Number(v) || 0)} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Campo label="Equipo actual" value={perfil.equipoActual} onChange={(v) => actualizar("equipoActual", v)} />
            <Campo label="Número de jersey" value={perfil.numeroJersey} onChange={(v) => actualizar("numeroJersey", v)} />
          </div>

          <Campo label="GPA / promedio escolar (opcional)" value={perfil.gpa || ""} onChange={(v) => actualizar("gpa", v)} />
        </section>

        {/* Contacto y redes */}
        <section className="bg-white border border-black/10 p-6 space-y-4">
          <h2 className="font-display text-2xl">Contacto y redes sociales</h2>
          <Campo label="Correo de contacto" type="email" value={perfil.emailContacto} onChange={(v) => actualizar("emailContacto", v)} required />
          <Campo label="Teléfono (opcional)" value={perfil.telefono || ""} onChange={(v) => actualizar("telefono", v)} />
          <div className="grid sm:grid-cols-3 gap-4">
            <Campo label="Instagram" value={perfil.instagram || ""} onChange={(v) => actualizar("instagram", v)} placeholder="@usuario" />
            <Campo label="Twitter / X" value={perfil.twitter || ""} onChange={(v) => actualizar("twitter", v)} placeholder="@usuario" />
            <Campo label="Hudl" value={perfil.hudl || ""} onChange={(v) => actualizar("hudl", v)} placeholder="Enlace" />
          </div>
        </section>

        {/* Sobre mí */}
        <section className="bg-white border border-black/10 p-6 space-y-4">
          <h2 className="font-display text-2xl">Sobre mí y objetivos</h2>
          <TextArea label="Sobre mí" value={perfil.sobreMi} onChange={(v) => actualizar("sobreMi", v)} />
          <TextArea label="Objetivos deportivos" value={perfil.objetivosDeportivos} onChange={(v) => actualizar("objetivosDeportivos", v)} />
        </section>

        {/* Estadísticas */}
        <section className="bg-white border border-black/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Estadísticas</h2>
            <button type="button" onClick={agregarEstadistica} className="text-sm text-turf underline">+ Agregar temporada</button>
          </div>
          {perfil.estadisticas.length === 0 && <p className="text-sm text-steel">Aún no agregas estadísticas.</p>}
          {perfil.estadisticas.map((est, idx) => (
            <div key={idx} className="border border-black/10 p-4 space-y-3">
              <div className="grid sm:grid-cols-3 gap-3">
                <Campo label="Temporada" value={est.temporada} onChange={(v) => actualizarEstadistica(idx, "temporada", v)} />
                <Campo label="Yardas" type="number" value={String(est.yardas ?? "")} onChange={(v) => actualizarEstadistica(idx, "yardas", v)} />
                <Campo label="Touchdowns" type="number" value={String(est.touchdowns ?? "")} onChange={(v) => actualizarEstadistica(idx, "touchdowns", v)} />
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <Campo label="Tackleos" type="number" value={String(est.tackleos ?? "")} onChange={(v) => actualizarEstadistica(idx, "tackleos", v)} />
                <Campo label="Intercepciones" type="number" value={String(est.intercepciones ?? "")} onChange={(v) => actualizarEstadistica(idx, "intercepciones", v)} />
                <Campo label="Sacks" type="number" value={String(est.sacks ?? "")} onChange={(v) => actualizarEstadistica(idx, "sacks", v)} />
              </div>
              <Campo label="Otros datos" value={est.otros || ""} onChange={(v) => actualizarEstadistica(idx, "otros", v)} />
              <button type="button" onClick={() => quitarEstadistica(idx)} className="text-sm text-red-600">Quitar temporada</button>
            </div>
          ))}
        </section>

        {/* Logros */}
        <section className="bg-white border border-black/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Logros</h2>
            <button type="button" onClick={agregarLogro} className="text-sm text-turf underline">+ Agregar logro</button>
          </div>
          {perfil.logros.length === 0 && <p className="text-sm text-steel">Aún no agregas logros.</p>}
          {perfil.logros.map((logro, idx) => (
            <div key={logro.id} className="border border-black/10 p-4 space-y-3">
              <div className="grid sm:grid-cols-3 gap-3">
                <Campo label="Título" value={logro.titulo} onChange={(v) => actualizarLogro(idx, "titulo", v)} />
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <select
                    value={logro.tipo}
                    onChange={(e) => actualizarLogro(idx, "tipo", e.target.value)}
                    className="w-full border border-black/20 px-3 py-2"
                  >
                    <option>Campeonato</option>
                    <option>Premio</option>
                    <option>Reconocimiento</option>
                    <option>Camp/Tryout</option>
                  </select>
                </div>
                <Campo label="Año" value={logro.anio} onChange={(v) => actualizarLogro(idx, "anio", v)} />
              </div>
              <Campo label="Descripción (opcional)" value={logro.descripcion || ""} onChange={(v) => actualizarLogro(idx, "descripcion", v)} />
              <button type="button" onClick={() => quitarLogro(idx)} className="text-sm text-red-600">Quitar logro</button>
            </div>
          ))}
        </section>

        {/* Experiencia */}
        <section className="bg-white border border-black/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Experiencia</h2>
            <button type="button" onClick={agregarExperiencia} className="text-sm text-turf underline">+ Agregar experiencia</button>
          </div>
          {perfil.experiencia.length === 0 && <p className="text-sm text-steel">Aún no agregas experiencia.</p>}
          {perfil.experiencia.map((exp, idx) => (
            <div key={exp.id} className="border border-black/10 p-4 space-y-3">
              <div className="grid sm:grid-cols-3 gap-3">
                <Campo label="Equipo" value={exp.equipo} onChange={(v) => actualizarExperiencia(idx, "equipo", v)} />
                <Campo label="Temporada" value={exp.temporada} onChange={(v) => actualizarExperiencia(idx, "temporada", v)} />
                <Campo label="Rol" value={exp.rol} onChange={(v) => actualizarExperiencia(idx, "rol", v)} />
              </div>
              <Campo label="Descripción (opcional)" value={exp.descripcion || ""} onChange={(v) => actualizarExperiencia(idx, "descripcion", v)} />
              <button type="button" onClick={() => quitarExperiencia(idx)} className="text-sm text-red-600">Quitar experiencia</button>
            </div>
          ))}
        </section>

        {/* Publicación */}
        <section className="bg-white border border-black/10 p-6 space-y-4">
          <h2 className="font-display text-2xl">Visibilidad</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={perfil.publicado}
              onChange={(e) => actualizar("publicado", e.target.checked)}
            />
            <span>Publicar mi perfil para que coaches puedan encontrarlo en Explorar</span>
          </label>
          {perfil.publicado && enlacePublico && (
            <p className="text-sm text-steel break-all">
              Enlace para compartir: <span className="text-turf">{enlacePublico}</span>
            </p>
          )}
        </section>

        <div className="flex items-center gap-4 sticky bottom-4">
          <button
            type="submit"
            className="bg-turf hover:bg-turfdark transition-colors text-chalk px-6 py-3 font-display text-lg tracking-wide"
          >
            Guardar cambios
          </button>
          {guardado && <span className="text-sm text-turf">Cambios guardados.</span>}
        </div>
      </form>
    </div>
  );
}

function Campo({
  label, value, onChange, type = "text", required, placeholder
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-black/20 px-3 py-2 focus:border-turf outline-none"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full border border-black/20 px-3 py-2 focus:border-turf outline-none"
      />
    </div>
  );
}

export default function EditarPerfilPage() {
  return (
    <ProtectedRoute tipoRequerido="jugador">
      <EditarPerfilContenido />
    </ProtectedRoute>
  );
}
