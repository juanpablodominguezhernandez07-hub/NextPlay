"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { iniciarSesion, obtenerSesion } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { refrescar } = useAuth();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const resultado = iniciarSesion(email, password);
    if (!resultado.ok) {
      setError(resultado.error || "No fue posible iniciar sesión.");
      return;
    }
    refrescar();
    const sesion = obtenerSesion();
    router.push(sesion?.tipo === "coach" ? "/coach/dashboard" : "/jugador/dashboard");
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <h1 className="font-display text-4xl mb-2">Iniciar sesión</h1>
      <p className="text-steel mb-8">Entra a tu cuenta de NextPlay.</p>

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
          Iniciar sesión
        </button>
      </form>

      <p className="text-sm text-steel mt-8">
        ¿No tienes cuenta?{" "}
        <Link href="/registro/jugador" className="text-turf underline">Regístrate como jugador</Link>
        {" "}o{" "}
        <Link href="/registro/coach" className="text-turf underline">como coach</Link>.
      </p>
    </div>
  );
}
