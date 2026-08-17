import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Administration</h1>

        <p className="mt-2 text-zinc-500">Gérez votre restaurant.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/orders"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">Commandes</h2>

            <p className="mt-2 text-sm text-zinc-500">
              Voir et gérer les commandes.
            </p>
          </Link>

          <Link
            href="/admin/menu"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">Menu</h2>

            <p className="mt-2 text-sm text-zinc-500">
              Gérer les catégories et produits.
            </p>
          </Link>

          <Link
            href="/admin/tables"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">Tables</h2>

            <p className="mt-2 text-sm text-zinc-500">
              Gérer les tables et QR codes.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
