import { prisma } from "@/lib/prisma";
import { deleteCategory } from "./category/delete-action";

export default async function AdminMenuPage() {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: "le-saphir-bleu",
    },
    include: {
      categories: {
        include: {
          products: {
            orderBy: {
              name: "asc",
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-zinc-100 p-6">
        <p>Restaurant introuvable.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Menu</h1>
            <p className="mt-2 text-zinc-500">{restaurant.name}</p>
          </div>

          <div className="flex gap-3">
            <a
              href="/admin"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm"
            >
              Retour
            </a>

            <a
              href="/admin/menu/category/new"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium"
            >
              Nouvelle catégorie
            </a>

            <a
              href="/admin/menu/new"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Ajouter un produit
            </a>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {restaurant.categories.map((category) => (
            <section
              key={category.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{category.name}</h2>

                <div className="flex items-center gap-2">
                  <a
                    href={`/admin/menu/category/${category.id}/edit`}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                  >
                    Modifier
                  </a>

                  <form action={deleteCategory}>
                    <input
                      type="hidden"
                      name="categoryId"
                      value={category.id}
                    />

                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {category.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b border-zinc-100 py-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>

                      {product.description && (
                        <p className="mt-1 text-sm text-zinc-500">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">
                          {product.price.toString()} TND
                        </p>

                        <p className="text-xs text-zinc-500">
                          {product.available ? "Disponible" : "Indisponible"}
                        </p>
                      </div>

                      <a
                        href={`/admin/menu/${product.id}/edit`}
                        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                      >
                        Modifier
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
