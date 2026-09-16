# NextPlay

**Tu siguiente jugada empieza hoy.**

Plataforma de recruiting para jugadores de fútbol americano que buscan
oportunidades universitarias. Los jugadores crean un perfil deportivo
profesional con highlights, estadísticas y currículum; los coaches buscan,
filtran y descubren prospectos.

## Tecnología

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (autenticación, base de datos y storage) — con **modo demo**
  que funciona sin configurar nada, usando `localStorage`

## 1. Instalación

```bash
cd nextplay
npm install
```

## 2. Ejecutar en modo demo (sin backend)

Por defecto la app corre en **modo demo**: no necesitas Supabase para
probarla. Todos los datos (usuarios, perfiles, highlights, favoritos) se
guardan en el `localStorage` de tu navegador, y se incluyen jugadores
ficticios de ejemplo.

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Flujo sugerido para probar:

1. Entra como jugador: **Crear mi perfil** → completa el formulario en
   *Editar perfil* → márcalo como **Publicado**.
2. Sube un highlight desde **Subir highlight** (pega un enlace de YouTube).
3. Genera tu **Currículum deportivo** y descárgalo como PDF (usa el botón
   "Descargar como PDF", que abre el diálogo de impresión del navegador).
4. Cierra sesión, crea una cuenta de **coach**, ve a **Explorar jugadores**,
   filtra por posición/estado/generación y abre un perfil.
5. Desde el perfil del jugador, guarda como favorito y contáctalo.

## 3. Conectar Supabase (base de datos real)

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En **Project Settings → API**, copia la **URL** y la **anon public key**.
3. Copia `.env.example` a `.env.local` y pega tus valores:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   NEXT_PUBLIC_DEMO_MODE=false
   ```

4. En el **SQL Editor** de Supabase, ejecuta el contenido completo de
   `supabase/schema.sql`. Esto crea todas las tablas, relaciones y
   políticas de seguridad (RLS) necesarias.
5. Activa **Email/Password** en **Authentication → Providers**.
6. Reemplaza las funciones de `src/lib/store.ts` (marcadas con comentarios
   `// TODO Supabase`) por llamadas a `supabase.auth` y
   `supabase.from("tabla")`. Las firmas de las funciones ya están
   diseñadas para ese reemplazo directo, así que el resto de la app
   (páginas y componentes) no necesita cambios.

### Videos de highlights: YouTube vs. Storage

Para la primera versión, los highlights se agregan pegando un enlace de
YouTube (no requiere configuración adicional). Si prefieres permitir
subida directa de archivos de video:

1. Crea un bucket en **Supabase Storage** (ver comentario al final de
   `supabase/schema.sql`) o usa Firebase Storage.
2. Sube el archivo con `supabase.storage.from("highlights").upload(...)`.
3. Guarda la ruta devuelta en el campo `storage_path` de la tabla
   `highlights` y construye la URL pública para reproducirlo.

La interfaz de `src/app/jugador/highlights/page.tsx` ya está lista para
adaptarse a ese flujo: solo hay que agregar un `<input type="file">`
adicional junto al campo de enlace de YouTube.

## 4. Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Llave pública (anon) de Supabase |
| `NEXT_PUBLIC_DEMO_MODE` | `true` = usa localStorage, `false` = usa Supabase |

## 5. Estructura del proyecto

```
nextplay/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Landing page
│   │   ├── login/page.tsx
│   │   ├── registro/jugador/page.tsx
│   │   ├── registro/coach/page.tsx
│   │   ├── explorar/page.tsx            # Búsqueda y filtros
│   │   ├── jugadores/[id]/page.tsx      # Perfil público del jugador
│   │   ├── jugador/dashboard/page.tsx
│   │   ├── jugador/perfil/editar/page.tsx
│   │   ├── jugador/highlights/page.tsx
│   │   ├── jugador/curriculum/page.tsx
│   │   └── coach/dashboard/page.tsx
│   ├── components/                      # Navbar, Footer, PlayerCard, etc.
│   └── lib/
│       ├── types.ts                     # Tipos compartidos
│       ├── store.ts                     # Capa de datos (localStorage / Supabase)
│       ├── mockData.ts                  # Jugadores de demostración
│       ├── auth-context.tsx             # Sesión de usuario
│       └── supabaseClient.ts
└── supabase/schema.sql                  # Esquema completo + RLS
```

## 6. Seguridad

- Rutas de jugador/coach protegidas por `ProtectedRoute` (redirige a
  `/login` si no hay sesión, o al dashboard correcto si el tipo de cuenta
  no coincide).
- Un jugador solo puede editar su propio perfil (en Supabase, forzado
  además por las políticas RLS de `supabase/schema.sql`).
- Las claves de Supabase usadas en el frontend son la **anon key**
  pública, diseñada para exponerse en el cliente; el acceso a datos
  reales se controla con RLS, no con el secreto de servicio.
- No se muestran contraseñas ni datos privados innecesarios en los
  perfiles públicos.

## Notas

- Los jugadores de ejemplo (`src/lib/mockData.ts`) son completamente
  ficticios y están marcados como "(demo)".
- El modo demo persiste en el navegador: si limpias el `localStorage`,
  los datos de prueba se recrean automáticamente al recargar.
