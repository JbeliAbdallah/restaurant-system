import { prisma } from "@/lib/prisma";
import { updateCategory } from "./actions";
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    return <main>Catégorie introuvable.</main>;
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Modifier la catégorie</h1>

        <p className="mt-2 text-zinc-500">Modifiez le nom de la catégorie.</p>

        <form
          action={updateCategory.bind(null, category.id)}
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
              defaultValue={category.name}
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
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
