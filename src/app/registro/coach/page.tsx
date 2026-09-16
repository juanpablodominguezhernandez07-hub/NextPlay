"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registrarUsuario, iniciarSesion } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";

export default function RegistroCoachPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { refrescar } = useAuth();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    const res = registrarUsuario(email, password, "coach");
    if (!res.ok) {
      setError(res.error || "No fue posible crear la cuenta.");
      return;
    }
    iniciarSesion(email, password);
    refrescar();
    router.push("/coach/dashboard");
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="font-display text-4xl mb-2">Crear cuenta de coach</h1>
      <p className="text-steel mb-8">
        Descubre jugadores y da seguimiento a tus prospectos en NextPlay.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Correo electrónico</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black/20 px-3 py-2 focus:border-turf outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-black/20 px-3 py-2 focus:border-turf outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-turf hover:bg-turfdark transition-colors text-chalk py-3 font-display text-lg tracking-wide"
        >
          Crear cuenta de coach
        </button>
      </form>

      <p className="text-sm text-steel mt-8">
        ¿Eres jugador?{" "}
        <Link href="/registro/jugador" className="text-turf underline">Crea tu perfil deportivo</Link>.
        <br />
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-turf underline">Inicia sesión</Link>.
      </p>
    </div>
  );
}
