"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  total: string;
  createdAt: string;
  table: {
    number: number;
  };
  items: {
    id: string;
    quantity: number;
    unitPrice: string;
    product: {
      name: string;
    };
  }[];
};

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadOrders() {
    const response = await fetch("/api/orders");
    const data = await response.json();

    if (Array.isArray(data)) {
      setOrders(data);
    }
  }
  async function updateStatus(orderId: string, status: string) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        status,
      }),
    });

    setOrders((current) =>
      status === "COMPLETED"
        ? current.filter((order) => order.id !== orderId)
        : current.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
    );
  }
  useEffect(() => {
    const interval = setInterval(loadOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold">Commandes</h1>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">Aucune commande en cours.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-xl font-bold">
                      Table {order.table.number}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                    {order.status}
                  </span>
                </div>

                <div className="my-5 space-y-2 border-y py-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity} × {item.product.name}
                      </span>

                      <span>
                        {(Number(item.unitPrice) * item.quantity).toFixed(3)}{" "}
                        TND
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{Number(order.total).toFixed(3)} TND</span>
                </div>

                <div className="mt-4">
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => updateStatus(order.id, "PREPARING")}
                      className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white"
                    >
                      Préparer
                    </button>
                  )}

                  {order.status === "PREPARING" && (
                    <button
                      onClick={() => updateStatus(order.id, "READY")}
                      className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white"
                    >
                      Commande prête
                    </button>
                  )}

                  {order.status === "READY" && (
                    <button
                      onClick={() => updateStatus(order.id, "COMPLETED")}
                      className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white"
                    >
                      Terminée
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
