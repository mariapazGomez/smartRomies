export function formatPrecio(precio: number) {
  return precio.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

/** `mes` en formato "YYYY-MM" (ej. "2026-08") → "Agosto 2026". */
export function formatMes(mes: string) {
  const [year, month] = mes.split("-").map(Number);
  const texto = new Intl.DateTimeFormat("es-CL", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
