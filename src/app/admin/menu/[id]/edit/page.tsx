import { prisma } from "@/lib/prisma";
import { updateProduct } from "./actions";
import { deleteProduct } from "./delete-action";
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: true,
      category: true,
    },
  });

  if (!product) {
    return <main>Produit introuvable.</main>;
  }

  const categories = await prisma.category.findMany({
    where: {
      restaurantId: product.restaurantId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Modifier le produit</h1>

        <p className="mt-2 text-zinc-500">
          Modifiez les informations de {product.name}.
        </p>

        <form
          action={updateProduct.bind(null, product.id)}
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
              defaultValue={product.name}
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
              defaultValue={product.description ?? ""}
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
              defaultValue={product.price.toString()}
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
              defaultValue={product.categoryId}
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black"
            >
              {categories.map((category) => (
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
              defaultChecked={product.available}
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
              Enregistrer
            </button>

            <button
              type="submit"
              formAction={deleteProduct.bind(null, product.id)}
              className="rounded-lg bg-red-600 px-4 py-3 font-medium text-white"
            >
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
