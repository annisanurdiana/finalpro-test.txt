import Cors from "micro-cors";
import stripelnit from "stripe";
import verifyStripe from "@webdeveducation/next-verify-stripe";
import clientPromise from "../../../lib/mongodb";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = stripelnit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req, res) => {
  if (req.method === "POST") {
    let event;
    try {
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret,
      });
    } catch (e) {
      console.log("ERROR: ", e);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        // Connect to the MongoDB database and access the "GeneratorApp" database from the connected MongoDB client
        const client = await clientPromise;
        const db = client.db("GeneratorApp");
        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.sub;

        // Update the userProfile document in the "users" collection
        const userProfile = await db.collection("users").updateOne(
          {
            auth0Id, // Match the document with the provided auth0Id
          },
          {
            $inc: {
              availableTokens: 100, // Increment the availableTokens
            },
            $setOnInsert: {
              auth0Id, // Set the auth0Id field on document insert
            },
          },
          {
            upsert: true, // Create a new document if no match is found
          }
        );
      }
      default:
        console.log("UNHANDLED EVENT: ", event.type);
    }
    res.status(200).json({ received: true });
  }
};

export default cors(handler);
