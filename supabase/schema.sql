-- =====================================================================
-- NextPlay — Esquema de base de datos para Supabase (PostgreSQL)
-- Ejecuta este script completo en el SQL Editor de tu proyecto Supabase.
-- Usa supabase.auth para usuarios; estas tablas usan auth.users(id).
-- =====================================================================

-- Tipo de cuenta
create type tipo_usuario as enum ('jugador', 'coach');

-- Extiende la información del usuario autenticado (auth.users)
create table perfiles_usuario (
  id uuid primary key references auth.users(id) on delete cascade,
  tipo tipo_usuario not null,
  creado_en timestamptz not null default now()
);

-- Perfil deportivo del jugador
create table perfiles_jugador (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre_completo text not null default '',
  foto_url text default '',
  edad int default 0,
  ciudad_estado text default '',
  escuela text default '',
  generacion text default '',
  posicion text default 'QB',
  posicion_secundaria text,
  altura_cm int default 0,
  peso_kg int default 0,
  mano_dominante text default 'Derecha',
  telefono text,
  email_contacto text default '',
  equipo_actual text default '',
  numero_jersey text default '',
  gpa text,
  instagram text,
  twitter text,
  hudl text,
  sobre_mi text default '',
  objetivos_deportivos text default '',
  publicado boolean not null default false,
  visitas_perfil int not null default 0,
  creado_en timestamptz not null default now(),
  unique (user_id)
);

create table estadisticas_jugador (
  id uuid primary key default gen_random_uuid(),
  jugador_id uuid not null references perfiles_jugador(id) on delete cascade,
  temporada text not null,
  yardas int,
  touchdowns int,
  tackleos int,
  intercepciones int,
  sacks int,
  otros text
);

create table logros_jugador (
  id uuid primary key default gen_random_uuid(),
  jugador_id uuid not null references perfiles_jugador(id) on delete cascade,
  titulo text not null,
  tipo text not null,
  anio text not null,
  descripcion text
);

create table experiencia_jugador (
  id uuid primary key default gen_random_uuid(),
  jugador_id uuid not null references perfiles_jugador(id) on delete cascade,
  equipo text not null,
  temporada text not null,
  rol text not null,
  descripcion text
);

-- Highlights: enlace de YouTube o, si se configura Storage, ruta al archivo
create table highlights (
  id uuid primary key default gen_random_uuid(),
  jugador_id uuid not null references perfiles_jugador(id) on delete cascade,
  titulo text not null,
  descripcion text,
  temporada text not null,
  posicion text not null,
  youtube_url text,
  storage_path text, -- usado si se sube video directo a Supabase Storage
  miniatura text,
  creado_en timestamptz not null default now()
);

-- Perfil del coach / reclutador
create table perfiles_coach (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre_completo text default '',
  programa text default '',
  cargo text default '',
  ciudad_estado text default '',
  email_contacto text default '',
  telefono text,
  unique (user_id)
);

create table favoritos_coach (
  coach_id uuid not null references perfiles_coach(id) on delete cascade,
  jugador_id uuid not null references perfiles_jugador(id) on delete cascade,
  creado_en timestamptz not null default now(),
  primary key (coach_id, jugador_id)
);

create table vistos_recientes_coach (
  coach_id uuid not null references perfiles_coach(id) on delete cascade,
  jugador_id uuid not null references perfiles_jugador(id) on delete cascade,
  visto_en timestamptz not null default now(),
  primary key (coach_id, jugador_id)
);

-- =====================================================================
-- Seguridad a nivel de fila (RLS)
-- =====================================================================
alter table perfiles_usuario enable row level security;
alter table perfiles_jugador enable row level security;
alter table estadisticas_jugador enable row level security;
alter table logros_jugador enable row level security;
alter table experiencia_jugador enable row level security;
alter table highlights enable row level security;
alter table perfiles_coach enable row level security;
alter table favoritos_coach enable row level security;
alter table vistos_recientes_coach enable row level security;

-- Cualquiera puede leer perfiles de jugador publicados (para Explorar)
create policy "Perfiles publicados son públicos"
  on perfiles_jugador for select
  using (publicado = true or auth.uid() = user_id);

-- Un jugador solo puede insertar/editar su propio perfil
create policy "Jugador administra su propio perfil"
  on perfiles_jugador for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Estadísticas, logros, experiencia y highlights: visibles si el perfil
-- asociado está publicado, editables solo por su dueño
create policy "Ver estadísticas de perfiles publicados"
  on estadisticas_jugador for select
  using (
    exists (
      select 1 from perfiles_jugador p
      where p.id = jugador_id and (p.publicado or p.user_id = auth.uid())
    )
  );
create policy "Jugador administra sus estadísticas"
  on estadisticas_jugador for all
  using (exists (select 1 from perfiles_jugador p where p.id = jugador_id and p.user_id = auth.uid()))
  with check (exists (select 1 from perfiles_jugador p where p.id = jugador_id and p.user_id = auth.uid()));

create policy "Ver logros de perfiles publicados"
  on logros_jugador for select
  using (exists (select 1 from perfiles_jugador p where p.id = jugador_id and (p.publicado or p.user_id = auth.uid())));
create policy "Jugador administra sus logros"
  on logros_jugador for all
  using (exists (select 1 from perfiles_jugador p where p.id = jugador_id and p.user_id = auth.uid()))
  with check (exists (select 1 from perfiles_jugador p where p.id = jugador_id and p.user_id = auth.uid()));

create policy "Ver experiencia de perfiles publicados"
  on experiencia_jugador for select
  using (exists (select 1 from perfiles_jugador p where p.id = jugador_id and (p.publicado or p.user_id = auth.uid())));
create policy "Jugador administra su experiencia"
  on experiencia_jugador for all
  using (exists (select 1 from perfiles_jugador p where p.id = jugador_id and p.user_id = auth.uid()))
  with check (exists (select 1 from perfiles_jugador p where p.id = jugador_id and p.user_id = auth.uid()));

create policy "Ver highlights de perfiles publicados"
  on highlights for select
  using (exists (select 1 from perfiles_jugador p where p.id = jugador_id and (p.publicado or p.user_id = auth.uid())));
create policy "Jugador administra sus highlights"
  on highlights for all
  using (exists (select 1 from perfiles_jugador p where p.id = jugador_id and p.user_id = auth.uid()))
  with check (exists (select 1 from perfiles_jugador p where p.id = jugador_id and p.user_id = auth.uid()));

-- Coaches solo administran su propio perfil y sus propios favoritos/vistos
create policy "Coach administra su propio perfil"
  on perfiles_coach for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Coach administra sus favoritos"
  on favoritos_coach for all
  using (exists (select 1 from perfiles_coach c where c.id = coach_id and c.user_id = auth.uid()))
  with check (exists (select 1 from perfiles_coach c where c.id = coach_id and c.user_id = auth.uid()));

create policy "Coach administra sus vistos recientes"
  on vistos_recientes_coach for all
  using (exists (select 1 from perfiles_coach c where c.id = coach_id and c.user_id = auth.uid()))
  with check (exists (select 1 from perfiles_coach c where c.id = coach_id and c.user_id = auth.uid()));

create policy "Usuario administra su propio registro"
  on perfiles_usuario for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- =====================================================================
-- Storage (opcional): bucket para video/foto si no usas enlaces de YouTube
-- Ejecuta esto si quieres permitir subida directa de archivos:
--
-- insert into storage.buckets (id, name, public) values ('highlights', 'highlights', true);
-- insert into storage.buckets (id, name, public) values ('fotos-perfil', 'fotos-perfil', true);
-- =====================================================================
