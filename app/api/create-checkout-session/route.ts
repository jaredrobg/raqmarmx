import Stripe from "stripe";
import { client } from "../../lib/contentful";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface Item {
  id: string;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const { items } = await req.json() as { items: Item[] };

    let total = 0;

    const line_items = await Promise.all(
      items.map(async (item) => {

        if (!item.id) throw new Error("Item sin ID");
        if (item.quantity <= 0) throw new Error("Cantidad inválida");

        const entry = await client.getEntry(item.id);

        if (!entry || !entry.fields) {
          throw new Error("Producto no encontrado");
        }

        const fields = entry.fields as {
          nombre: string;
          precio: number;
          cantidad?: number;
        };

        if (!fields.precio || fields.precio <= 0) {
          throw new Error("Precio inválido");
        }

        if (fields.cantidad && item.quantity > fields.cantidad) {
          throw new Error("No hay suficiente stock");
        }

        // 🔥 sumar total
        total += fields.precio * item.quantity;

        return {
          price_data: {
            currency: "mxn",
            product_data: {
              name: fields.nombre,
            },
            unit_amount: Math.round(fields.precio * 100),
          },
          quantity: item.quantity,
        };
      })
    );

    // 🚚 lógica de envío
    const COSTO_ENVIO = 200;
    const ENVIO_GRATIS_DESDE = 2000;

    if (total < ENVIO_GRATIS_DESDE) {
      line_items.push({
        price_data: {
          currency: "mxn",
          product_data: {
            name: "Costo de envío",
          },
          unit_amount: COSTO_ENVIO * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return Response.json({ url: session.url });

  } catch (err) {
    if (err instanceof Error) {
      console.error("Error al crear checkout:", err);
      return Response.json({ error: err.message }, { status: 500 });
    } else {
      return Response.json({ error: "Error desconocido" }, { status: 500 });
    }
  }
}