import { prisma } from "@/lib/prisma";
import { createCategory } from "./actions";
export default async function NewCategoryPage() {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: "le-saphir-bleu",
    },
  });

  if (!restaurant) {
    return <main>Restaurant introuvable.</main>;
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Nouvelle catégorie</h1>

        <p className="mt-2 text-zinc-500">
          Ajoutez une nouvelle catégorie au menu.
        </p>

        <form
          action={createCategory}
          className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-sm"
        >
          {" "}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nom de la catégorie
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ex: Desserts"
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <a
              href="/admin/menu"
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-center font-medium"
            >
              Annuler
            </a>

            <button
              type="submit"
              className="flex-1 rounded-lg bg-black px-4 py-3 font-medium text-white"
            >
              Ajouter la catégorie
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
