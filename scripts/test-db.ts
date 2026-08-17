import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const count = await prisma.restaurant.count();
  console.log(`Restaurants in database: ${count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
