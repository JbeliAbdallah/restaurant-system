"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteCategory(formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "");

  if (!categoryId) {
    throw new Error("Catégorie invalide.");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      products: true,
    },
  });

  if (!category) {
    throw new Error("Catégorie introuvable.");
  }

  if (category.products.length > 0) {
    throw new Error(
      "Impossible de supprimer une catégorie contenant des produits.",
    );
  }

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  redirect("/admin/menu");
}
