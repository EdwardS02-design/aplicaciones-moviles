-- Petcare: cuentas y mascotas por usuario (PostgreSQL / Supabase)
--
-- Cómo usarlo:
-- 1. Proyecto en supabase.com → SQL Editor → pega TODO este archivo → Run
-- 2. Authentication → Providers → Email:
--    desactiva "Confirm email" mientras pruebas en clase
-- 3. La contraseña NO va en esta tabla: la guarda Supabase Auth (auth.users)
--    de forma cifrada. public.usuarios es la ficha de cada cuenta.
-- 4. Cada mascota, cita y actividad apunta a usuarios.id

create extension if not exists "pgcrypto";

-- Si ya existía "perfiles", la pasamos a "usuarios"
do $$
begin
  if to_regclass('public.perfiles') is not null
     and to_regclass('public.usuarios') is null then
    alter table public.perfiles rename to usuarios;
  end if;
end $$;

create table if not exists public.usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null default '',
  correo text,
  ciudad text default 'Lima, Perú',
  foto_url text,
  ultimo_ingreso timestamptz,
  creado_en timestamptz not null default now()
);

alter table public.usuarios add column if not exists correo text;
alter table public.usuarios add column if not exists ultimo_ingreso timestamptz;
alter table public.usuarios add column if not exists ciudad text;
alter table public.usuarios add column if not exists foto_url text;
alter table public.usuarios add column if not exists creado_en timestamptz;

update public.usuarios u
set correo = a.email
from auth.users a
where u.id = a.id
  and (u.correo is null or btrim(u.correo) = '');

create unique index if not exists usuarios_correo_unico
  on public.usuarios (lower(correo))
  where correo is not null;

create table if not exists public.mascotas (
  id uuid primary key default gen_random_uuid(),
  dueno_id uuid not null references public.usuarios (id) on delete cascade,
  nombre text not null,
  categoria text not null check (categoria in ('perro', 'gato', 'conejo')),
  raza text,
  edad_anios numeric,
  peso_kg numeric,
  foto_url text,
  color_ficha text default '#f0d1a0',
  creado_en timestamptz not null default now()
);

create table if not exists public.citas (
  id uuid primary key default gen_random_uuid(),
  dueno_id uuid not null references public.usuarios (id) on delete cascade,
  mascota_id uuid not null,
  tipo text not null,
  titulo text not null,
  lugar text,
  fecha date not null,
  hora text,
  creado_en timestamptz not null default now()
);

create table if not exists public.actividades (
  id uuid primary key default gen_random_uuid(),
  dueno_id uuid not null references public.usuarios (id) on delete cascade,
  mascota_id uuid not null,
  tipo text not null,
  titulo text not null,
  hora text,
  duracion_min integer,
  fecha date not null default (timezone('America/Lima', now()))::date,
  creado_en timestamptz not null default now()
);

create table if not exists public.preferencias (
  dueno_id uuid primary key references public.usuarios (id) on delete cascade,
  recordatorios boolean not null default true,
  avisos_citas boolean not null default true,
  alerta_vacunas boolean not null default true,
  resumen_semanal boolean not null default false,
  modo_oscuro boolean not null default false,
  idioma text not null default 'es-PE',
  unidad_peso text not null default 'kg'
);

create index if not exists mascotas_dueno_idx on public.mascotas (dueno_id);
create unique index if not exists mascotas_id_dueno_uidx on public.mascotas (id, dueno_id);
create index if not exists citas_dueno_fecha_idx on public.citas (dueno_id, fecha);
create index if not exists actividades_dueno_fecha_idx on public.actividades (dueno_id, fecha);

alter table public.citas drop constraint if exists citas_mascota_id_fkey;
alter table public.citas drop constraint if exists citas_mascota_dueno_fkey;
alter table public.citas add constraint citas_mascota_dueno_fkey
  foreign key (mascota_id, dueno_id)
  references public.mascotas (id, dueno_id) on delete cascade;

alter table public.actividades drop constraint if exists actividades_mascota_id_fkey;
alter table public.actividades drop constraint if exists actividades_mascota_dueno_fkey;
alter table public.actividades add constraint actividades_mascota_dueno_fkey
  foreign key (mascota_id, dueno_id)
  references public.mascotas (id, dueno_id) on delete cascade;

alter table public.usuarios enable row level security;
alter table public.mascotas enable row level security;
alter table public.citas enable row level security;
alter table public.actividades enable row level security;
alter table public.preferencias enable row level security;

drop policy if exists "ver_mi_perfil" on public.usuarios;
drop policy if exists "ver_mi_usuario" on public.usuarios;
create policy "ver_mi_usuario" on public.usuarios
  for select using (auth.uid() = id);

drop policy if exists "editar_mi_perfil" on public.usuarios;
drop policy if exists "editar_mi_usuario" on public.usuarios;
create policy "editar_mi_usuario" on public.usuarios
  for update using (auth.uid() = id);

drop policy if exists "crear_mi_perfil" on public.usuarios;
drop policy if exists "crear_mi_usuario" on public.usuarios;
create policy "crear_mi_usuario" on public.usuarios
  for insert with check (auth.uid() = id);

drop policy if exists "ver_mis_mascotas" on public.mascotas;
create policy "ver_mis_mascotas" on public.mascotas
  for select using (auth.uid() = dueno_id);

drop policy if exists "crear_mascota" on public.mascotas;
create policy "crear_mascota" on public.mascotas
  for insert with check (auth.uid() = dueno_id);

drop policy if exists "editar_mascota" on public.mascotas;
create policy "editar_mascota" on public.mascotas
  for update using (auth.uid() = dueno_id);

drop policy if exists "borrar_mascota" on public.mascotas;
create policy "borrar_mascota" on public.mascotas
  for delete using (auth.uid() = dueno_id);

drop policy if exists "ver_mis_citas" on public.citas;
create policy "ver_mis_citas" on public.citas
  for select using (auth.uid() = dueno_id);

drop policy if exists "crear_cita" on public.citas;
create policy "crear_cita" on public.citas
  for insert with check (auth.uid() = dueno_id);

drop policy if exists "editar_cita" on public.citas;
create policy "editar_cita" on public.citas
  for update using (auth.uid() = dueno_id);

drop policy if exists "borrar_cita" on public.citas;
create policy "borrar_cita" on public.citas
  for delete using (auth.uid() = dueno_id);

drop policy if exists "ver_mis_actividades" on public.actividades;
create policy "ver_mis_actividades" on public.actividades
  for select using (auth.uid() = dueno_id);

drop policy if exists "crear_actividad" on public.actividades;
create policy "crear_actividad" on public.actividades
  for insert with check (auth.uid() = dueno_id);

drop policy if exists "editar_actividad" on public.actividades;
create policy "editar_actividad" on public.actividades
  for update using (auth.uid() = dueno_id);

drop policy if exists "borrar_actividad" on public.actividades;
create policy "borrar_actividad" on public.actividades
  for delete using (auth.uid() = dueno_id);

drop policy if exists "ver_mis_preferencias" on public.preferencias;
create policy "ver_mis_preferencias" on public.preferencias
  for select using (auth.uid() = dueno_id);

drop policy if exists "crear_preferencias" on public.preferencias;
create policy "crear_preferencias" on public.preferencias
  for insert with check (auth.uid() = dueno_id);

drop policy if exists "editar_preferencias" on public.preferencias;
create policy "editar_preferencias" on public.preferencias
  for update using (auth.uid() = dueno_id);

-- Al registrarse en Auth, nace la fila en public.usuarios
create or replace function public.al_crear_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuarios (id, nombre, correo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update
    set correo = excluded.correo,
        nombre = coalesce(public.usuarios.nombre, excluded.nombre);

  insert into public.preferencias (dueno_id)
  values (new.id)
  on conflict (dueno_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.al_crear_usuario();

create or replace function public.marcar_ingreso()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'No hay sesión';
  end if;

  update public.usuarios
  set ultimo_ingreso = now()
  where id = auth.uid();
end;
$$;

revoke all on function public.al_crear_usuario() from public, anon, authenticated;
revoke all on function public.marcar_ingreso() from public, anon;
grant execute on function public.marcar_ingreso() to authenticated;

insert into storage.buckets (id, name, public)
values ('fotos-mascotas', 'fotos-mascotas', true)
on conflict (id) do nothing;

drop policy if exists "leer_fotos" on storage.objects;
create policy "leer_fotos" on storage.objects
  for select using (bucket_id = 'fotos-mascotas');

drop policy if exists "subir_mi_foto" on storage.objects;
create policy "subir_mi_foto" on storage.objects
  for insert with check (
    bucket_id = 'fotos-mascotas'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "actualizar_mi_foto" on storage.objects;
create policy "actualizar_mi_foto" on storage.objects
  for update using (
    bucket_id = 'fotos-mascotas'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "borrar_mi_foto" on storage.objects;
create policy "borrar_mi_foto" on storage.objects
  for delete using (
    bucket_id = 'fotos-mascotas'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
