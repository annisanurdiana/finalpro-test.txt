import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    // Retrieve the authenticated user's sub (subject) from the session
    const {
      user: { sub },
    } = await getSession(req, res);
    // Get the MongoDB client instance from the clientPromise
    const client = await clientPromise;
    // Access the "GeneratorApp" database
    const db = client.db("GeneratorApp");
    // Find the user profile based on the auth0Id
    const userProfile = await db.collection("users").findOne({
      auth0Id: sub,
    });

    // Retrieve the lastPostDate and getNewerPosts from the request body
    const { lastPostDate, getNewerPosts } = req.body;
    
    // Query the "posts" collection based on the userId and date criteria
    const posts = await db
      .collection("posts")
      .find({
        userId: userProfile._id,
        // $gt = greater than, $lt = less than
        created: { [getNewerPosts ? "$gt" : "$lt"]: new Date(lastPostDate) },
      })
      .limit(getNewerPosts ? 0 : 5) // Limit the number of posts to retrieve
      .sort({ created: -1 }) // Sort the posts by created date in descending order
      .toArray(); // Convert the cursor result to an array of posts

    // Send the retrieved posts in the response
    res.status(200).json({ posts });
    return;
  } catch (e) {
    // If an error occurs, log the error message
    console.log("ERROR GET POST: ", e);
  }
});
