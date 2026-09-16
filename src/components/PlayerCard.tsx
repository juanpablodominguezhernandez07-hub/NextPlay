import Link from "next/link";
import Image from "next/image";
import { PerfilJugador } from "@/lib/types";

export default function PlayerCard({ jugador }: { jugador: PerfilJugador }) {
  return (
    <div className="bg-white border border-black/10 flex flex-col">
      <div className="relative w-full aspect-[4/3] bg-stadium">
        {jugador.fotoUrl ? (
          <Image
            src={jugador.fotoUrl}
            alt={jugador.nombreCompleto}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-chalk font-display text-3xl">
            {jugador.posicion}
          </div>
        )}
        <span className="absolute top-2 left-2 bg-gold text-stadium font-display text-sm px-2 py-0.5 tracking-wide">
          {jugador.posicion}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1">
        <h3 className="font-display text-xl leading-tight">{jugador.nombreCompleto}</h3>
        <p className="text-sm text-steel">{jugador.escuela}</p>
        <p className="text-sm text-steel">Generación {jugador.generacion} · {jugador.ciudadEstado}</p>
        <p className="text-sm text-steel mb-3">
          {jugador.alturaCm} cm · {jugador.pesoKg} kg
        </p>
        <Link
          href={`/jugadores/${jugador.id}`}
          className="mt-auto text-center bg-stadium text-chalk py-2 font-display tracking-wide hover:bg-turfdark transition-colors"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  );
}
