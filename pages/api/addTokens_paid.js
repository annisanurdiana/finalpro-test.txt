// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// Import necessary dependencies
import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import stripeInit from "stripe";

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);

// Define the API route handler
export default async function handler(req, res) {
  // Retrieve the user session
  const { user } = await getSession(req, res);

  // test user session
  console.log("user: ", user);

  const lineItems = [
    {
      price: process.env.STRIPE_PRODUCT_PRICE_ID,
      quantity: 1,
    },
  ];
  const protocol = process.env.NODE_ENV === "development" ? "http://" : "https://";
  const host = req.headers.host;
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${protocol}${host}/success`,
    payment_intent_data: {
      metadata: {
        sub: user.sub,
      },
    },
    metadata: {
      sub: user.sub,
    },
  });

  // Connect to the MongoDB database and access the "GeneratorApp" database from the connected MongoDB client
  const client = await clientPromise;
  const db = client.db("GeneratorApp");
  // Update the userProfile document in the "users" collection
  const userProfile = await db.collection("users").updateOne(
    {
      auth0Id: user.sub, // Match the document with the provided auth0Id
    },
    {
      $inc: {
        availableTokens: 100, // Increment the availableTokens
      },
      $setOnInsert: {
        auth0Id: user.sub, // Set the auth0Id field on document insert
      },
    },
    {
      upsert: true, // Create a new document if no match is found
    }
  );
  console.log("Checkout Session:", checkoutSession);
  // Respond with a status of 200 and a JSON object
  res.status(200).json({ session: checkoutSession });
}
