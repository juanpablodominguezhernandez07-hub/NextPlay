"use client";

import {
  Usuario,
  PerfilJugador,
  PerfilCoach,
  Highlight,
  SesionActual,
  TipoUsuario
} from "./types";
import { jugadoresDemo } from "./mockData";

// --------------------------------------------------------------------
// Capa de datos de NextPlay.
//
// En modo demo (por defecto) toda la información vive en localStorage
// del navegador, para que la plataforma sea 100% funcional sin
// necesidad de configurar un backend externo.
//
// Cuando conectes Supabase (ver supabaseClient.ts), reemplaza el
// cuerpo de cada función marcada con "TODO Supabase" por la llamada
// equivalente a `supabase.from("tabla")...`. Las firmas (parámetros
// y valores de retorno) ya están pensadas para ese reemplazo, así que
// el resto de la aplicación no necesita cambiar.
// --------------------------------------------------------------------

const KEYS = {
  usuarios: "nextplay_usuarios",
  jugadores: "nextplay_jugadores",
  coaches: "nextplay_coaches",
  sesion: "nextplay_sesion",
  seed: "nextplay_seed_v1"
};

function leer<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function escribir<T>(key: string, valor: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(valor));
}

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Siembra los datos de demostración la primera vez que se usa la app.
export function asegurarSeed() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(KEYS.seed)) return;
  escribir(KEYS.jugadores, jugadoresDemo);
  escribir(KEYS.usuarios, []);
  escribir(KEYS.coaches, []);
  window.localStorage.setItem(KEYS.seed, "1");
}

// ---------------- Usuarios / autenticación ----------------

export function registrarUsuario(
  email: string,
  password: string,
  tipo: TipoUsuario
): { ok: boolean; error?: string; usuario?: Usuario } {
  // TODO Supabase: reemplazar por supabase.auth.signUp({ email, password })
  const usuarios = leer<Usuario[]>(KEYS.usuarios, []);
  if (usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "Ya existe una cuenta con ese correo." };
  }
  const nuevo: Usuario = {
    id: uuid(),
    email,
    password,
    tipo,
    creadoEn: new Date().toISOString()
  };
  usuarios.push(nuevo);
  escribir(KEYS.usuarios, usuarios);

  if (tipo === "jugador") {
    const jugadores = leer<PerfilJugador[]>(KEYS.jugadores, []);
    const perfil: PerfilJugador = {
      id: uuid(),
      userId: nuevo.id,
      nombreCompleto: "",
      fotoUrl: "",
      edad: 0,
      ciudadEstado: "",
      escuela: "",
      generacion: "",
      posicion: "QB",
      alturaCm: 0,
      pesoKg: 0,
      manoDominante: "Derecha",
      emailContacto: email,
      equipoActual: "",
      numeroJersey: "",
      sobreMi: "",
      objetivosDeportivos: "",
      estadisticas: [],
      logros: [],
      experiencia: [],
      highlights: [],
      publicado: false,
      visitasPerfil: 0,
      creadoEn: new Date().toISOString()
    };
    jugadores.push(perfil);
    escribir(KEYS.jugadores, jugadores);
  } else {
    const coaches = leer<PerfilCoach[]>(KEYS.coaches, []);
    const perfil: PerfilCoach = {
      id: uuid(),
      userId: nuevo.id,
      nombreCompleto: "",
      programa: "",
      cargo: "",
      ciudadEstado: "",
      emailContacto: email,
      favoritos: [],
      vistosRecientes: []
    };
    coaches.push(perfil);
    escribir(KEYS.coaches, coaches);
  }

  return { ok: true, usuario: nuevo };
}

export function iniciarSesion(
  email: string,
  password: string
): { ok: boolean; error?: string } {
  // TODO Supabase: reemplazar por supabase.auth.signInWithPassword(...)
  const usuarios = leer<Usuario[]>(KEYS.usuarios, []);
  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!usuario) return { ok: false, error: "Correo o contraseña incorrectos." };
  const sesion: SesionActual = { usuarioId: usuario.id, tipo: usuario.tipo };
  escribir(KEYS.sesion, sesion);
  return { ok: true };
}

export function cerrarSesion() {
  // TODO Supabase: reemplazar por supabase.auth.signOut()
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.sesion);
}

export function obtenerSesion(): SesionActual | null {
  return leer<SesionActual | null>(KEYS.sesion, null);
}

// ---------------- Perfiles de jugador ----------------

export function listarJugadores(): PerfilJugador[] {
  // TODO Supabase: reemplazar por supabase.from("perfiles_jugador").select("*")
  asegurarSeed();
  return leer<PerfilJugador[]>(KEYS.jugadores, []);
}

export function obtenerJugadorPorId(id: string): PerfilJugador | undefined {
  return listarJugadores().find((j) => j.id === id);
}

export function obtenerJugadorPorUserId(userId: string): PerfilJugador | undefined {
  return listarJugadores().find((j) => j.userId === userId);
}

export function guardarPerfilJugador(perfil: PerfilJugador) {
  // TODO Supabase: reemplazar por supabase.from("perfiles_jugador").update(...).eq("id", perfil.id)
  const jugadores = listarJugadores();
  const idx = jugadores.findIndex((j) => j.id === perfil.id);
  if (idx >= 0) jugadores[idx] = perfil;
  else jugadores.push(perfil);
  escribir(KEYS.jugadores, jugadores);
}

export function agregarHighlight(jugadorId: string, highlight: Highlight) {
  const jugadores = listarJugadores();
  const idx = jugadores.findIndex((j) => j.id === jugadorId);
  if (idx < 0) return;
  jugadores[idx].highlights.push(highlight);
  escribir(KEYS.jugadores, jugadores);
}

export function eliminarHighlight(jugadorId: string, highlightId: string) {
  const jugadores = listarJugadores();
  const idx = jugadores.findIndex((j) => j.id === jugadorId);
  if (idx < 0) return;
  jugadores[idx].highlights = jugadores[idx].highlights.filter(
    (h) => h.id !== highlightId
  );
  escribir(KEYS.jugadores, jugadores);
}

export function registrarVisitaPerfil(jugadorId: string) {
  const jugadores = listarJugadores();
  const idx = jugadores.findIndex((j) => j.id === jugadorId);
  if (idx < 0) return;
  jugadores[idx].visitasPerfil += 1;
  escribir(KEYS.jugadores, jugadores);
}

// ---------------- Perfiles de coach ----------------

export function obtenerCoachPorUserId(userId: string): PerfilCoach | undefined {
  const coaches = leer<PerfilCoach[]>(KEYS.coaches, []);
  return coaches.find((c) => c.userId === userId);
}

export function guardarPerfilCoach(perfil: PerfilCoach) {
  const coaches = leer<PerfilCoach[]>(KEYS.coaches, []);
  const idx = coaches.findIndex((c) => c.id === perfil.id);
  if (idx >= 0) coaches[idx] = perfil;
  else coaches.push(perfil);
  escribir(KEYS.coaches, coaches);
}

export function alternarFavorito(coachUserId: string, jugadorId: string) {
  const coaches = leer<PerfilCoach[]>(KEYS.coaches, []);
  const idx = coaches.findIndex((c) => c.userId === coachUserId);
  if (idx < 0) return;
  const favoritos = coaches[idx].favoritos;
  coaches[idx].favoritos = favoritos.includes(jugadorId)
    ? favoritos.filter((id) => id !== jugadorId)
    : [...favoritos, jugadorId];
  escribir(KEYS.coaches, coaches);
}

export function registrarVistoReciente(coachUserId: string, jugadorId: string) {
  const coaches = leer<PerfilCoach[]>(KEYS.coaches, []);
  const idx = coaches.findIndex((c) => c.userId === coachUserId);
  if (idx < 0) return;
  const vistos = coaches[idx].vistosRecientes.filter((id) => id !== jugadorId);
  vistos.unshift(jugadorId);
  coaches[idx].vistosRecientes = vistos.slice(0, 10);
  escribir(KEYS.coaches, coaches);
}

// ---------------- Filtros de Explorar ----------------

export interface FiltrosExplorar {
  texto?: string;
  posicion?: string;
  generacion?: string;
  estado?: string;
  escuela?: string;
  alturaMinCm?: number;
  pesoMinKg?: number;
}

export function filtrarJugadores(filtros: FiltrosExplorar): PerfilJugador[] {
  const jugadores = listarJugadores().filter((j) => j.publicado);
  return jugadores.filter((j) => {
    if (filtros.texto) {
      const t = filtros.texto.toLowerCase();
      if (!j.nombreCompleto.toLowerCase().includes(t)) return false;
    }
    if (filtros.posicion && j.posicion !== filtros.posicion) return false;
    if (filtros.generacion && j.generacion !== filtros.generacion) return false;
    if (
      filtros.estado &&
      !j.ciudadEstado.toLowerCase().includes(filtros.estado.toLowerCase())
    )
      return false;
    if (
      filtros.escuela &&
      !j.escuela.toLowerCase().includes(filtros.escuela.toLowerCase())
    )
      return false;
    if (filtros.alturaMinCm && j.alturaCm < filtros.alturaMinCm) return false;
    if (filtros.pesoMinKg && j.pesoKg < filtros.pesoMinKg) return false;
    return true;
  });
}
