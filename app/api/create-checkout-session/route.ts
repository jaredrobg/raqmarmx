import Stripe from "stripe";
import {client} from "../../lib/contentful";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface Item {
  quantity: number;
  id: string;
}

export async function POST(req: Request) {
  try {
    const { items } = await req.json() as { items: Item[] };

    
    console.log("ITEMS:", items);

    //  traer productos reales desde Contentful
    const line_items = await Promise.all(
      items.map(async (item) => {
        if (item.quantity <= 0) {
          throw new Error("Cantidad inválida");
        }
        const entry = await client.getEntry(item.id);
        if (!entry || !entry.fields) {
          throw new Error("Producto no encontrado");
        }

        const fields: any = entry.fields;

        if (item.quantity > fields.cantidad) {
          throw new Error("No hay suficiente stock");
        }

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    if(err instanceof Error){
      console.error("Error al crear checkout:", err);
      return Response.json({ error: err.message }, { status: 500 });
    } else {
      console.error("Error desconocido al crear checkout");
      return Response.json({ error: "Error desconocido" }, { status: 500 }); 
    }
  }
}
