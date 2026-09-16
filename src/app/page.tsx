import Link from "next/link";
import Image from "next/image";

const pasos = [
  { numero: "01", titulo: "Crea tu perfil", texto: "Registra tus datos físicos, posición, escuela y generación en minutos." },
  { numero: "02", titulo: "Sube tus highlights", texto: "Agrega tus mejores jugadas en video, con título y contexto de cada una." },
  { numero: "03", titulo: "Agrega estadísticas y logros", texto: "Construye un historial deportivo claro: campeonatos, premios y camps." },
  { numero: "04", titulo: "Comparte con coaches", texto: "Envía tu perfil con un enlace directo o déjate encontrar en Explorar." }
];

const beneficiosJugador = [
  "Un perfil profesional que se ve como los de recruiting real.",
  "Currículum deportivo generado automáticamente.",
  "Estadísticas de visitas a tu perfil.",
  "Un solo enlace para compartir con cualquier programa."
];

const beneficiosCoach = [
  "Filtra jugadores por posición, altura, peso, escuela y generación.",
  "Revisa highlights, estadísticas y logros en un solo lugar.",
  "Guarda jugadores como favoritos para dar seguimiento.",
  "Contacta directamente desde el perfil del jugador."
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-stadium text-chalk field-lines">
        <div className="max-w-6xl mx-auto px-5 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-display text-gold tracking-widest text-sm mb-4">
              RECRUITING DE FÚTBOL AMERICANO
            </p>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] font-semibold mb-6">
              Tu siguiente jugada empieza hoy.
            </h1>
            <p className="text-steel text-lg max-w-md mb-8">
              NextPlay conecta a jugadores de fútbol americano con coaches y
              programas universitarios. Crea tu perfil deportivo, sube tus
              highlights y deja que te encuentren.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/registro/jugador"
                className="bg-turf hover:bg-turfdark transition-colors px-6 py-3 font-display text-lg tracking-wide"
              >
                Crear mi perfil
              </Link>
              <Link
                href="/explorar"
                className="border border-chalk/40 hover:border-gold hover:text-gold transition-colors px-6 py-3 font-display text-lg tracking-wide"
              >
                Explorar jugadores
              </Link>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=900&h=700&fit=crop"
              alt="Jugador de fútbol americano en juego"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="font-display text-3xl mb-10">Cómo funciona</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
          {pasos.map((paso) => (
            <div key={paso.numero} className="bg-chalk p-6">
              <p className="font-display text-gold text-2xl mb-3">{paso.numero}</p>
              <h3 className="font-display text-xl mb-2">{paso.titulo}</h3>
              <p className="text-sm text-steel">{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="bg-white scoreboard-rule">
        <div className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl mb-6">Para jugadores</h2>
            <ul className="space-y-3">
              {beneficiosJugador.map((b) => (
                <li key={b} className="flex gap-3 text-steel">
                  <span className="text-turf font-display text-xl">—</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/registro/jugador"
              className="inline-block mt-6 font-display text-lg tracking-wide text-turf hover:text-turfdark"
            >
              Crear mi perfil de jugador
            </Link>
          </div>
          <div>
            <h2 className="font-display text-3xl mb-6">Para coaches</h2>
            <ul className="space-y-3">
              {beneficiosCoach.map((b) => (
                <li key={b} className="flex gap-3 text-steel">
                  <span className="text-turf font-display text-xl">—</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/registro/coach"
              className="inline-block mt-6 font-display text-lg tracking-wide text-turf hover:text-turfdark"
            >
              Crear cuenta de coach
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-stadium text-chalk">
        <div className="max-w-6xl mx-auto px-5 py-16 text-center">
          <h2 className="font-display text-3xl mb-4">
            Tu perfil deportivo, listo para ser descubierto.
          </h2>
          <Link
            href="/registro/jugador"
            className="inline-block mt-4 bg-gold text-stadium px-6 py-3 font-display text-lg tracking-wide hover:bg-white transition-colors"
          >
            Empezar ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
