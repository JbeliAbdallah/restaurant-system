"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("categoryId")?.toString();
  const available = formData.get("available") === "on";

  if (!name || !categoryId || !Number.isFinite(price) || price < 0) {
    throw new Error("Données du produit invalides.");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: "le-saphir-bleu",
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant introuvable.");
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      restaurantId: restaurant.id,
    },
  });

  if (!category) {
    throw new Error("Catégorie invalide.");
  }

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      available,
      restaurantId: restaurant.id,
      categoryId: category.id,
    },
  });

  redirect("/admin/menu");
}
