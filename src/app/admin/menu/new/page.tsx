import { prisma } from "@/lib/prisma";
import { createProduct } from "./actions";

export default async function NewProductPage() {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: "le-saphir-bleu",
    },
    include: {
      categories: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!restaurant) {
    return <main>Restaurant introuvable.</main>;
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Ajouter un produit</h1>

          <p className="mt-2 text-zinc-500">
            Ajoutez un nouveau produit au menu.
          </p>
        </div>

        <form
          action={createProduct}
          className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-sm"
        >
          {" "}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nom
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ex: Couscous royal"
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Description du produit..."
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium">
              Prix (TND)
            </label>

            <input
              id="price"
              name="price"
              type="number"
              step="0.001"
              min="0"
              placeholder="18.000"
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium">
              Catégorie
            </label>

            <select
              id="categoryId"
              name="categoryId"
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black"
              defaultValue=""
            >
              <option value="" disabled>
                Sélectionnez une catégorie
              </option>

              {restaurant.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="available"
              name="available"
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />

            <label htmlFor="available" className="text-sm font-medium">
              Produit disponible
            </label>
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
              Ajouter le produit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
