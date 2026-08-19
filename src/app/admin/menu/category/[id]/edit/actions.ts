"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateCategory(categoryId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Le nom de la catégorie est obligatoire.");
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
    },
  });

  redirect("/admin/menu");
}
