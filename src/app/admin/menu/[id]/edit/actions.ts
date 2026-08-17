"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateProduct(productId: string, formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("categoryId")?.toString();
  const available = formData.get("available") === "on";

  if (!name || !categoryId || !Number.isFinite(price) || price < 0) {
    throw new Error("Données du produit invalides.");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Produit introuvable.");
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      restaurantId: product.restaurantId,
    },
  });

  if (!category) {
    throw new Error("Catégorie invalide.");
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      description,
      price,
      categoryId,
      available,
    },
  });

  redirect("/admin/menu");
}
