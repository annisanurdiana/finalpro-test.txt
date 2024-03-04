// Import necessary dependencies
import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../lib/mongodb";

// Function to get the props for the app
export const getAppProps = async (ctx) => {
  // Get the user session using Auth0
  const userSession = await getSession(ctx.req, ctx.res);

  // Connect to the MongoDB client and Access the "GeneratorApp" database
  const client = await clientPromise;
  const db = client.db("GeneratorApp");

  // Find the user in the "users" collection based on the Auth0 user ID
  const user = await db.collection("users").findOne({
    auth0Id: userSession.user.sub,
  });

  // If the user doesn't exist, return default values
  if (!user) {
    return {
      availableTokens: 0,
      posts: [],
    };
  }

  // Retrieve the user's posts from the "posts" collection
  const posts = await db
    .collection("posts")
    .find({
      userId: user._id,
    })
    .limit(5)
    .sort({
      created: -1,
    })
    .toArray();

  // Format the posts and return the props
  return {
    availableTokens: user.availableTokens,
    posts: posts.map(({ created, _id, userId, ...rest }) => ({
      _id: _id.toString(),
      created: created.toString(),
      ...rest,
    })),
    postId: ctx.params?.postId || null,
  };
};
