import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase preparado para producción.
// Mientras NEXT_PUBLIC_DEMO_MODE sea "true", la app no usa este
// cliente y en su lugar guarda todo en localStorage (ver store.ts).
//
// Para conectar Supabase real:
// 1. Crea un proyecto en https://supabase.com
// 2. Copia la URL y la anon key a tu archivo .env.local
// 3. Ejecuta el script supabase/schema.sql en el SQL Editor de tu proyecto
// 4. Cambia NEXT_PUBLIC_DEMO_MODE a "false"
// 5. Implementa las funciones de src/lib/store.ts usando supabase.from(...)
//    en vez de localStorage (las firmas de las funciones ya están listas
//    para ese reemplazo, ver comentarios "TODO Supabase" en ese archivo).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isDemoMode = () =>
  process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
