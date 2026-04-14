import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface Item {
  quantity: number;
  name: string;
  price: number;
}

export async function POST(req: Request) {
  try {
    const { items } = await req.json() as { items: Item[] };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item: Item) => ({
        price_data: {
          currency: "mxn", // cámbialo a tu moneda
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      })),
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
