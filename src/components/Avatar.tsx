// Colores de fondo para el avatar placeholder (iniciales). Sin foto real todavía
// — ver "Fuera de alcance" en vault/03-Historias-de-Usuario/US-08-resumen-por-integrante.md.
const COLORES = [
  "bg-rose-200 text-rose-900",
  "bg-amber-200 text-amber-900",
  "bg-lime-200 text-lime-900",
  "bg-teal-200 text-teal-900",
  "bg-sky-200 text-sky-900",
  "bg-violet-200 text-violet-900",
  "bg-fuchsia-200 text-fuchsia-900",
];

function colorPara(nombre: string) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = (hash * 31 + nombre.charCodeAt(i)) % COLORES.length;
  }
  return COLORES[Math.abs(hash)];
}

function iniciales(nombre: string) {
  return nombre.trim().charAt(0).toUpperCase();
}

export default function Avatar({
  nombre,
  size = "sm",
}: {
  nombre: string;
  size?: "sm" | "lg";
}) {
  const tamano = size === "lg" ? "h-16 w-16 text-2xl" : "h-14 w-14 text-xl";
  return (
    <div
      className={`flex ${tamano} items-center justify-center rounded-full font-semibold ${colorPara(
        nombre
      )}`}
    >
      {iniciales(nombre)}
    </div>
  );
}
