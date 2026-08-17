import { prisma } from "@/lib/prisma";
import MenuClient from "@/components/MenuClient";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ table?: string }>;
};

export default async function RestaurantMenu({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { table } = await searchParams;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          products: {
            where: { available: true },
            orderBy: { name: "asc" },
          },
        },
      },
    },
  });

  if (!restaurant) {
    return <main>Restaurant not found.</main>;
  }

  const categories = restaurant.categories.map((category) => ({
    id: category.id,
    name: category.name,
    products: category.products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
    })),
  }));

  return (
    <MenuClient
      restaurantId={restaurant.id}
      restaurantName={restaurant.name}
      table={table}
      categories={categories}
    />
  );
}
