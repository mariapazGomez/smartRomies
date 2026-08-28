-- SmartRomies — Modelo de datos v1: registro de usos de lavadora/secadora
--
-- Diseño documentado en el vault:
--   /vault/01-Decisiones/2026-08-28-modelo-datos-v1-alcance.md
--   /vault/01-Decisiones/2026-08-28-seguridad-sin-auth.md
--   /vault/02-Modelo-de-Datos/{members,action_types,usage_records}.md
--
-- Alcance: un solo hogar, sin login de usuarios, dos acciones cobrables
-- (lavado/secado) con precio fijo congelado por uso.

create extension if not exists pgcrypto;

-- =========================================================
-- members: integrantes del hogar
-- =========================================================
create table members (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null unique,
  activo     boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table members is 'Integrantes del hogar que pueden registrar usos de lavadora/secadora.';

-- =========================================================
-- action_types: catálogo de acciones cobrables (lavado, secado, ...)
-- =========================================================
create table action_types (
  codigo         text primary key,
  nombre         text not null,
  precio_actual  integer not null check (precio_actual >= 0),
  activo         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table action_types is 'Catálogo de acciones cobrables sobre la lavadora/secadora, con precio vigente configurable.';

insert into action_types (codigo, nombre, precio_actual) values
  ('lavado', 'Lavado', 2000),
  ('secado', 'Secado', 2000);

-- =========================================================
-- usage_records: cada uso registrado, con precio congelado
-- =========================================================
create table usage_records (
  id                  uuid primary key default gen_random_uuid(),
  member_id           uuid not null references members(id),
  action_type_codigo  text not null references action_types(codigo),
  precio_cobrado      integer not null check (precio_cobrado >= 0),
  fecha_uso           timestamptz not null default now(),
  notas               text,
  created_at          timestamptz not null default now()
);

comment on table usage_records is 'Evento de uso: quién hizo qué acción, cuándo, y a qué precio (congelado al momento del registro).';
comment on column usage_records.precio_cobrado is 'Snapshot de action_types.precio_actual al momento del registro; no se recalcula si el precio cambia después.';

create index idx_usage_records_fecha_uso on usage_records (fecha_uso);
create index idx_usage_records_member_fecha on usage_records (member_id, fecha_uso);

-- =========================================================
-- Row Level Security
--
-- No se crean policies para el rol anon/authenticated: sin policies,
-- RLS deniega todo por defecto. Las mutaciones y lecturas de la webapp
-- pasan por el backend de Next.js usando la service role key (que
-- ignora RLS), nunca por el cliente directamente.
-- Ver /vault/01-Decisiones/2026-08-28-seguridad-sin-auth.md
-- =========================================================

alter table members enable row level security;
alter table action_types enable row level security;
alter table usage_records enable row level security;
