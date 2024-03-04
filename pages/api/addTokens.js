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
  //console.log("user: ", user);

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
        availableTokens: 10, // Increment the availableTokens
      },
      $setOnInsert: {
        auth0Id: user.sub, // Set the auth0Id field on document insert
      },
    },
    {
      upsert: true, // Create a new document if no match is found
    }
  );

  // Respond with a status of 200 and a JSON object
  res.status(200).json({ name: "John Doe" });
}
