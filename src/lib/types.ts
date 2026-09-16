export type Posicion =
  | "QB" | "RB" | "WR" | "TE" | "OL" | "DL" | "LB" | "DB" | "K" | "P";

export type ManoDominante = "Izquierda" | "Derecha" | "Ambidiestro";

export interface Highlight {
  id: string;
  jugadorId: string;
  titulo: string;
  descripcion: string;
  temporada: string;
  posicion: Posicion;
  youtubeUrl: string;
  miniatura: string;
  creadoEn: string;
}

export interface Logro {
  id: string;
  titulo: string;
  tipo: "Campeonato" | "Premio" | "Reconocimiento" | "Camp/Tryout";
  anio: string;
  descripcion?: string;
}

export interface Experiencia {
  id: string;
  equipo: string;
  temporada: string;
  rol: string;
  descripcion?: string;
}

export interface Estadisticas {
  temporada: string;
  yardas?: number;
  touchdowns?: number;
  tackleos?: number;
  intercepciones?: number;
  sacks?: number;
  otros?: string;
}

export interface PerfilJugador {
  id: string;
  userId: string;
  nombreCompleto: string;
  fotoUrl: string;
  edad: number;
  ciudadEstado: string;
  escuela: string;
  generacion: string;
  posicion: Posicion;
  posicionSecundaria?: Posicion;
  alturaCm: number;
  pesoKg: number;
  manoDominante: ManoDominante;
  telefono?: string;
  emailContacto: string;
  equipoActual: string;
  numeroJersey: string;
  gpa?: string;
  instagram?: string;
  twitter?: string;
  hudl?: string;
  sobreMi: string;
  objetivosDeportivos: string;
  estadisticas: Estadisticas[];
  logros: Logro[];
  experiencia: Experiencia[];
  highlights: Highlight[];
  publicado: boolean;
  visitasPerfil: number;
  creadoEn: string;
}

export interface PerfilCoach {
  id: string;
  userId: string;
  nombreCompleto: string;
  programa: string;
  cargo: string;
  ciudadEstado: string;
  emailContacto: string;
  telefono?: string;
  favoritos: string[];
  vistosRecientes: string[];
}

export type TipoUsuario = "jugador" | "coach";

export interface Usuario {
  id: string;
  email: string;
  password: string;
  tipo: TipoUsuario;
  creadoEn: string;
}

export interface SesionActual {
  usuarioId: string;
  tipo: TipoUsuario;
}
