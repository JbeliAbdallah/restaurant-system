"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteProduct(productId: string) {
  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  redirect("/admin/menu");
}
