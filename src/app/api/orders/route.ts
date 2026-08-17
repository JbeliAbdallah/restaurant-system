import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { restaurantId, tableNumber, items } = body;

    if (
      !restaurantId ||
      !tableNumber ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    const table = await prisma.restaurantTable.findFirst({
      where: {
        restaurantId,
        number: Number(tableNumber),
      },
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    const productIds = items.map(
      (item: { productId: string }) => item.productId,
    );

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        restaurantId,
        available: true,
      },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "One or more products are unavailable" },
        { status: 400 },
      );
    }

    const orderItems = items.map(
      (item: { productId: string; quantity: number }) => {
        const product = products.find((p) => p.id === item.productId);

        if (!product) {
          throw new Error("Product not found");
        }

        return {
          productId: product.id,
          quantity: Number(item.quantity),
          unitPrice: product.price,
        };
      },
    );

    const total = orderItems.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0,
    );

    const order = await prisma.order.create({
      data: {
        restaurantId,
        tableId: table.id,
        total,
        items: {
          create: orderItems,
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 },
    );
  }
}
export async function GET() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: "le-saphir-bleu" },
  });

  if (!restaurant) {
    return NextResponse.json(
      { error: "Restaurant not found" },
      { status: 404 },
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      restaurantId: restaurant.id,
      status: {
        in: ["PENDING", "PREPARING", "READY"],
      },
    },
    include: {
      table: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(orders);
}
export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Could not update order" },
      { status: 500 },
    );
  }
}
