import { prisma } from "@/lib/prisma";
import TableQRCode from "@/components/TableQRCode";
export default async function AdminTablesPage() {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: "le-saphir-bleu",
    },
    include: {
      tables: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });

  if (!restaurant) {
    return <main>Restaurant introuvable.</main>;
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tables</h1>

            <p className="mt-2 text-zinc-500">{restaurant.name}</p>
          </div>

          <a
            href="/admin"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm"
          >
            Retour
          </a>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {restaurant.tables.map((table) => (
            <div key={table.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl font-bold">Table {table.number}</p>

              <p className="mt-3 break-all text-sm text-zinc-500">
                {table.qrCode}
              </p>
              <div className="mt-5 flex justify-center">
                <TableQRCode
                  url={`http://192.168.1.15:3000/r/${restaurant.slug}?table=${table.number}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
