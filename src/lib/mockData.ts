import { PerfilJugador } from "./types";

// Jugadores de demostración. Todos los datos son ficticios y sirven
// únicamente para probar la plataforma NextPlay.
export const jugadoresDemo: PerfilJugador[] = [
  {
    id: "demo-qb-1",
    userId: "demo-user-qb-1",
    nombreCompleto: "Mateo Villarreal (demo)",
    fotoUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop",
    edad: 17,
    ciudadEstado: "Querétaro, QRO",
    escuela: "Prepa Cumbres",
    generacion: "2026",
    posicion: "QB",
    alturaCm: 185,
    pesoKg: 84,
    manoDominante: "Derecha",
    emailContacto: "mateo.demo@nextplay.mx",
    equipoActual: "Cumbres Halcones",
    numeroJersey: "7",
    gpa: "9.2",
    instagram: "@mateo.qb.demo",
    sobreMi: "Quarterback titular desde 2do año, especializado en lectura rápida de defensas y pase de precisión.",
    objetivosDeportivos: "Conseguir beca para jugar NCAA Div. II u ONEFA.",
    estadisticas: [
      { temporada: "2025", yardas: 2450, touchdowns: 24, otros: "68% de pases completos" }
    ],
    logros: [
      { id: "l1", titulo: "MVP Liga Estatal", tipo: "Premio", anio: "2025" },
      { id: "l2", titulo: "Campeón Conferencia Centro", tipo: "Campeonato", anio: "2025" }
    ],
    experiencia: [
      { id: "e1", equipo: "Cumbres Halcones", temporada: "2024-2025", rol: "QB titular" }
    ],
    highlights: [
      {
        id: "h1",
        jugadorId: "demo-qb-1",
        titulo: "Highlights temporada 2025",
        descripcion: "Mejores jugadas como quarterback titular.",
        temporada: "2025",
        posicion: "QB",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        miniatura: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=340&fit=crop",
        creadoEn: "2025-11-02"
      }
    ],
    publicado: true,
    visitasPerfil: 142,
    creadoEn: "2025-01-15"
  },
  {
    id: "demo-rb-1",
    userId: "demo-user-rb-1",
    nombreCompleto: "Diego Fuentes (demo)",
    fotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    edad: 18,
    ciudadEstado: "Monterrey, NL",
    escuela: "Tec de Monterrey Prepa",
    generacion: "2025",
    posicion: "RB",
    alturaCm: 178,
    pesoKg: 88,
    manoDominante: "Izquierda",
    emailContacto: "diego.demo@nextplay.mx",
    equipoActual: "Borregos Prepa",
    numeroJersey: "22",
    gpa: "8.7",
    sobreMi: "Corredor explosivo con buena visión de campo y capacidad de recepción.",
    objetivosDeportivos: "Jugar en ONEFA y eventualmente en la NFL de México.",
    estadisticas: [
      { temporada: "2025", yardas: 1320, touchdowns: 16 }
    ],
    logros: [
      { id: "l3", titulo: "Camp de Élite Nacional", tipo: "Camp/Tryout", anio: "2025" }
    ],
    experiencia: [
      { id: "e2", equipo: "Borregos Prepa", temporada: "2023-2025", rol: "RB titular" }
    ],
    highlights: [
      {
        id: "h2",
        jugadorId: "demo-rb-1",
        titulo: "Jugadas destacadas 2025",
        descripcion: "Corridas y recepciones de la temporada regular.",
        temporada: "2025",
        posicion: "RB",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        miniatura: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=340&fit=crop",
        creadoEn: "2025-10-20"
      }
    ],
    publicado: true,
    visitasPerfil: 98,
    creadoEn: "2025-02-01"
  },
  {
    id: "demo-wr-1",
    userId: "demo-user-wr-1",
    nombreCompleto: "Santiago Rojas (demo)",
    fotoUrl: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=400&h=400&fit=crop",
    edad: 17,
    ciudadEstado: "CDMX",
    escuela: "Colegio Simón Bolívar",
    generacion: "2026",
    posicion: "WR",
    alturaCm: 182,
    pesoKg: 76,
    manoDominante: "Derecha",
    emailContacto: "santiago.demo@nextplay.mx",
    equipoActual: "Bolívar Águilas",
    numeroJersey: "11",
    sobreMi: "Receptor rápido con buenas manos y rutas precisas.",
    objetivosDeportivos: "Beca deportiva en universidad con programa de fútbol americano.",
    estadisticas: [
      { temporada: "2025", yardas: 980, touchdowns: 11 }
    ],
    logros: [],
    experiencia: [
      { id: "e3", equipo: "Bolívar Águilas", temporada: "2024-2025", rol: "WR titular" }
    ],
    highlights: [],
    publicado: true,
    visitasPerfil: 61,
    creadoEn: "2025-03-10"
  },
  {
    id: "demo-lb-1",
    userId: "demo-user-lb-1",
    nombreCompleto: "Emiliano Castro (demo)",
    fotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    edad: 18,
    ciudadEstado: "Guadalajara, JAL",
    escuela: "Prepa Vallarta",
    generacion: "2025",
    posicion: "LB",
    alturaCm: 188,
    pesoKg: 95,
    manoDominante: "Derecha",
    emailContacto: "emiliano.demo@nextplay.mx",
    equipoActual: "Vallarta Tiburones",
    numeroJersey: "44",
    sobreMi: "Linebacker físico, líder defensivo del equipo.",
    objetivosDeportivos: "Jugar a nivel universitario en EE.UU. o México.",
    estadisticas: [
      { temporada: "2025", tackleos: 88, sacks: 6, intercepciones: 2 }
    ],
    logros: [
      { id: "l4", titulo: "Jugador Defensivo del Año", tipo: "Premio", anio: "2025" }
    ],
    experiencia: [
      { id: "e4", equipo: "Vallarta Tiburones", temporada: "2023-2025", rol: "LB titular" }
    ],
    highlights: [],
    publicado: true,
    visitasPerfil: 77,
    creadoEn: "2025-01-28"
  },
  {
    id: "demo-ol-1",
    userId: "demo-user-ol-1",
    nombreCompleto: "Rodrigo Salinas (demo)",
    fotoUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop",
    edad: 18,
    ciudadEstado: "Puebla, PUE",
    escuela: "Prepa UPAEP",
    generacion: "2025",
    posicion: "OL",
    alturaCm: 193,
    pesoKg: 118,
    manoDominante: "Derecha",
    emailContacto: "rodrigo.demo@nextplay.mx",
    equipoActual: "UPAEP Lobos",
    numeroJersey: "70",
    sobreMi: "Tackle ofensivo con gran técnica de pies y protección de pase.",
    objetivosDeportivos: "Beca universitaria como offensive lineman.",
    estadisticas: [],
    logros: [],
    experiencia: [
      { id: "e5", equipo: "UPAEP Lobos", temporada: "2023-2025", rol: "OT titular" }
    ],
    highlights: [],
    publicado: true,
    visitasPerfil: 34,
    creadoEn: "2025-04-05"
  }
];
