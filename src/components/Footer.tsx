import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stadium text-chalk mt-20">
      <div className="max-w-6xl mx-auto px-5 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 bg-gold" aria-hidden="true" />
            <span className="font-display text-xl tracking-wide font-semibold">
              NEXTPLAY
            </span>
          </div>
          <p className="text-steel text-sm max-w-xs">
            Plataforma de recruiting para jugadores de fútbol americano y
            programas universitarios. Tu siguiente jugada empieza hoy.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg tracking-wide mb-3">Jugadores</h3>
          <ul className="space-y-2 text-sm text-steel">
            <li><Link href="/registro/jugador" className="hover:text-gold">Crear perfil</Link></li>
            <li><Link href="/jugador/dashboard" className="hover:text-gold">Mi dashboard</Link></li>
            <li><Link href="/jugador/curriculum" className="hover:text-gold">Currículum deportivo</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg tracking-wide mb-3">Coaches</h3>
          <ul className="space-y-2 text-sm text-steel">
            <li><Link href="/registro/coach" className="hover:text-gold">Crear cuenta de coach</Link></li>
            <li><Link href="/explorar" className="hover:text-gold">Explorar jugadores</Link></li>
            <li><Link href="/coach/dashboard" className="hover:text-gold">Mi dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="max-w-6xl mx-auto px-5 py-5 text-xs text-steel">
          © {new Date().getFullYear()} NextPlay. Plataforma de demostración construida con fines académicos.
        </p>
      </div>
    </footer>
  );
}
