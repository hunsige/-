import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { name, price } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [{
      price_data: {
        currency: "eur",
        product_data: { name },
        unit_amount: Math.round(parseFloat(price.replace('€','')) * 100)
      },
      quantity: 1
    }],
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel"
  });

  res.json({ url: session.url });
}
