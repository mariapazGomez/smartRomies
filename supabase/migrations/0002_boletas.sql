-- SmartRomies — Boletas variables (ingreso manual, prorrateo en partes iguales)
--
-- Diseño documentado en el vault:
--   /vault/01-Decisiones/2026-08-31-boletas-manuales.md
--   /vault/02-Modelo-de-Datos/boletas.md
--
-- Sin FK a members/usage_records: el reparto es una cifra congelada por
-- integrante al momento de la carga, no un evento por persona.

create table boletas (
  id                    uuid primary key default gen_random_uuid(),
  proveedor             text not null,
  periodo               text not null,
  monto_total           integer not null check (monto_total >= 0),
  cantidad_integrantes  integer not null check (cantidad_integrantes > 0),
  monto_por_persona     integer not null check (monto_por_persona >= 0),
  created_at            timestamptz not null default now()
);

comment on table boletas is 'Boleta variable (luz, agua, gas, ...) cargada a mano, con el monto ya repartido en partes iguales entre los integrantes activos al momento de la carga.';
comment on column boletas.cantidad_integrantes is 'Cantidad de members activos al momento de cargar la boleta; congelado, no se recalcula si cambia después.';
comment on column boletas.monto_por_persona is 'round(monto_total / cantidad_integrantes), congelado al momento de la carga.';

-- Mismo criterio de seguridad que 0001_init_schema.sql: RLS habilitado, sin
-- policies para anon/authenticated. Las mutaciones pasan por el backend con
-- la service role key. Ver /vault/01-Decisiones/2026-08-28-seguridad-sin-auth.md

alter table boletas enable row level security;
