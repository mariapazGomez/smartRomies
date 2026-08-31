export const CANTIDAD_MESES_SELECTOR = 12;

export function mesActualValue() {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}`;
}

/** Últimos N meses (incluido el actual), más reciente primero, como "YYYY-MM". */
export function mesesDisponibles(cantidad: number) {
  const ahora = new Date();
  return Array.from({ length: cantidad }, (_, i) => {
    const fecha = new Date(Date.UTC(ahora.getFullYear(), ahora.getMonth() - i, 1));
    return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}

/** Rango [desde, hasta) en ISO para un mes "YYYY-MM". */
export function rangoDeMes(mes: string) {
  const [year, month] = mes.split("-").map(Number);
  const desde = new Date(Date.UTC(year, month - 1, 1));
  const hasta = new Date(Date.UTC(year, month, 1));
  return { desde: desde.toISOString(), hasta: hasta.toISOString() };
}

/** Resuelve el mes elegido en la URL contra la lista disponible, con fallback al actual. */
export function resolverMesSeleccionado(mesParam: string | undefined, meses: string[]) {
  return mesParam && meses.includes(mesParam) ? mesParam : mesActualValue();
}
