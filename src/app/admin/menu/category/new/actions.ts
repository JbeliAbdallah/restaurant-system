"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Le nom de la catégorie est obligatoire.");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: "le-saphir-bleu",
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant introuvable.");
  }

  await prisma.category.create({
    data: {
      name,
      restaurantId: restaurant.id,
    },
  });

  redirect("/admin/menu");
}
