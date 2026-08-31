-- SmartRomies — Catálogo de proveedores de boletas variables
--
-- Diseño documentado en el vault:
--   /vault/02-Modelo-de-Datos/proveedores.md
--   /vault/02-Modelo-de-Datos/boletas.md
--
-- `boletas.proveedor` (texto libre) pasa a ser `boletas.proveedor_codigo`
-- (FK a un catálogo), mismo patrón que `action_types`/`usage_records.action_type_codigo`
-- (ver 0001_init_schema.sql), para poder agregar montos por proveedor de forma
-- confiable más adelante (sin depender de que el texto esté escrito siempre igual).
--
-- Asume `boletas` sin filas todavía (la migración falla igual, sin corromper
-- datos, si ya hubiera boletas cargadas: el ADD COLUMN ... NOT NULL sin
-- DEFAULT requiere la tabla vacía).

create table proveedores (
  codigo     text primary key,
  nombre     text not null,
  activo     boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table proveedores is 'Catálogo de proveedores de boletas variables (luz, agua, gas, ...), para estandarizar el campo y permitir agregar montos por proveedor más adelante.';

insert into proveedores (codigo, nombre) values
  ('luz', 'Luz'),
  ('agua', 'Agua'),
  ('gas', 'Gas');

alter table boletas drop column proveedor;
alter table boletas add column proveedor_codigo text not null references proveedores(codigo);

alter table proveedores enable row level security;
