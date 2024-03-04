// Import necessary dependencies
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

// Define the API route handler with authentication required
export default withApiAuthRequired(async function handler(req, res) {
  try {
    // Retrieve the user session information using the getSession function from "@auth0/nextjs-auth0"
    const {
      user: { sub },
    } = await getSession(req, res);
    // Establish the MongoDB client connection using the clientPromise from "../../lib/mongodb"
    const client = await clientPromise;
    // Access the "GeneratorApp" database from the connected MongoDB client
    const db = client.db("GeneratorApp");
    // Retrieve the userProfile document from the "users" collection based on the provided auth0Id
    const userProfile = await db.collection("users").findOne({
      auth0Id: sub,
    });

    // Extract the postId from the request body
    const { postId } = req.body;
    // Delete the post from the "posts" collection using the userId and _id fields
    await db.collection("posts").deleteOne({
      userId: userProfile._id, // Match the userId with the userProfile's _id
      _id: new ObjectId(postId), // Match the _id with the provided postId
    });
    // Respond with a status of 200 and a JSON object indicating success
    res.status(200).json({ success: true });
  } catch (e) {
    // Handle any errors that occur during the process
    console.log("Error trying to delete a post: ", e);
  }
  return;
});
