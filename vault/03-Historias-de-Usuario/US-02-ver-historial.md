# US-02: Ver historial de usos registrados

**Como** integrante del hogar,
**quiero** ver el historial de usos registrados (quién, qué acción, cuándo, precio cobrado),
**para** verificar que todo esté correcto y que no falte ni sobre ningún registro.

## Criterios de aceptación

- Se puede ver una lista de [[usage_records]] ordenada por `fecha_uso` descendente (más reciente primero).
- Cada fila del historial muestra: nombre del integrante ([[members]].nombre), tipo de acción ([[action_types]].nombre), fecha/hora (`fecha_uso`) y precio cobrado (`precio_cobrado`).
- Se puede filtrar el historial al menos por integrante y por rango de fechas (usa el índice `idx_usage_records_member_fecha` / `idx_usage_records_fecha_uso`).
- La lista es legible en una pantalla de celular (scroll vertical, sin tablas anchas).

## Fuera de alcance de esta historia

- Exportar el historial (CSV, PDF, etc.) — no se pide todavía.
- Búsqueda por texto libre en `notas`.

## Referencias

Modelo: [[usage_records]]. Ver [[00-Overview]] para las relaciones completas.
