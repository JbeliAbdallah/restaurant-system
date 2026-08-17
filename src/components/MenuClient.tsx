"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: string;
};

type Category = {
  id: string;
  name: string;
  products: Product[];
};

type Props = {
  restaurantId: string;
  restaurantName: string;
  table?: string;
  categories: Category[];
};

type CartItem = Product & {
  quantity: number;
};

export default function MenuClient({
  restaurantId,
  restaurantName,
  table,
  categories,
}: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ordering, setOrdering] = useState(false);
  const [success, setSuccess] = useState(false);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }

  function decrease(productId: string) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  async function placeOrder() {
    if (!table || cart.length === 0) return;

    setOrdering(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurantId,
        tableNumber: table,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    setOrdering(false);

    if (response.ok) {
      setCart([]);
      setSuccess(true);
    } else {
      alert("Impossible d'envoyer la commande.");
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ?
          </div>

          <h1 className="text-2xl font-bold">Commande envoyée !</h1>

          <p className="mt-3 text-gray-500">
            Votre commande a bien été envoyée à {restaurantName}.
          </p>

          <p className="mt-2 font-medium">Table {table}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-32">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{restaurantName}</h1>
          {table && <p className="mt-2 text-sm text-gray-500">Table {table}</p>}
        </header>

        <div className="space-y-8">
          {categories.map((category) => (
            <section key={category.id}>
              <h2 className="mb-4 text-xl font-bold">{category.name}</h2>

              <div className="space-y-3">
                {category.products.map((product) => {
                  const quantity =
                    cart.find((item) => item.id === product.id)?.quantity ?? 0;

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="mt-1 font-semibold">
                          {product.price} TND
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {quantity > 0 && (
                          <>
                            <button
                              onClick={() => decrease(product.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg"
                            >
                              -
                            </button>

                            <span className="w-5 text-center font-semibold">
                              {quantity}
                            </span>
                          </>
                        )}

                        <button
                          onClick={() => addToCart(product)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xl text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                {itemCount} article{itemCount > 1 ? "s" : ""}
              </p>
              <p className="text-lg font-bold">{total.toFixed(3)} TND</p>
            </div>

            <button
              onClick={placeOrder}
              disabled={ordering || !table}
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {ordering ? "Envoi..." : "Commander"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
