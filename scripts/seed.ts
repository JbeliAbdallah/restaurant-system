import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Le Saphir Bleu",
      slug: "le-saphir-bleu",
    },
  });

  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Plats", restaurantId: restaurant.id },
    }),
    prisma.category.create({
      data: { name: "Pizzas", restaurantId: restaurant.id },
    }),
    prisma.category.create({
      data: { name: "Boissons", restaurantId: restaurant.id },
    }),
  ]);

  await prisma.product.createMany({
    data: [
      { name: "Escalope grillee", price: 18, restaurantId: restaurant.id, categoryId: categories[0].id },
      { name: "Poisson grille", price: 22, restaurantId: restaurant.id, categoryId: categories[0].id },
      { name: "Pizza Margherita", price: 12, restaurantId: restaurant.id, categoryId: categories[1].id },
      { name: "Pizza 4 Fromages", price: 16, restaurantId: restaurant.id, categoryId: categories[1].id },
      { name: "Coca-Cola", price: 3, restaurantId: restaurant.id, categoryId: categories[2].id },
      { name: "Eau minerale", price: 2, restaurantId: restaurant.id, categoryId: categories[2].id },
    ],
  });

  await prisma.restaurantTable.createMany({
    data: [1, 2, 3, 4, 5].map((number) => ({
      number,
      qrCode: `table-${number}`,
      restaurantId: restaurant.id,
    })),
  });

  console.log(`Created restaurant: ${restaurant.name}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
