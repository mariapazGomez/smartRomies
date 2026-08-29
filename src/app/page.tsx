export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6 py-10">
      <h1 className="text-2xl font-semibold">SmartRomies</h1>
      <p className="text-base text-neutral-600 dark:text-neutral-400">
        Divide las cuentas del hogar compartido de forma clara. El registro de
        usos de lavadora y secadora llega en la próxima iteración.
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-500">
        Ver el modelo de datos y las historias de usuario en{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">
          /vault
        </code>
        .
      </p>
    </main>
  );
}
