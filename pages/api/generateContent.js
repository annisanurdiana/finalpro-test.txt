// Import necessary dependencies
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";

// Define the API route handler with authentication required
export default withApiAuthRequired(async function handler(req, res) {
  // Retrieve the user session information
  const { user } = await getSession(req, res);
  // Establish the MongoDB client connection
  const client = await clientPromise;
  // Access the "GeneratorApp" database from the connected MongoDB client
  const db = client.db("GeneratorApp");

  // Retrieve the userProfile document from the "users" collection based on the provided auth0Id
  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub,
  });

  // Check if the userProfile or availableTokens field is missing
  if (!userProfile?.availableTokens) {
    // Return a 403 Forbidden status if the requested resource is forbidden
    res.status(403);
    return;
  }

  // OpenAI Configuration object using the apiKey
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Instance of the OpenAIApi using the config
  const openai = new OpenAIApi(config);

  // Extract the topic and keywords from the request body
  const { use_case, topic, keywords, categorytype } = req.body;

  // Check if topic or keywords are missing
  if (!use_case || !topic || !keywords || !categorytype) {
    res.status(422);
    return;
  }

  // Check if topic or keywords exceed the maximum length of 80 characters
  if (topic.length > 80 || keywords.length > 100) {
    res.status(422);
    return;
  }

  // Use the OpenAI API to create a completion using the gpt-3.5-turbo model
  const postContentResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You are a ${use_case} generator`,
      },
      {
        role: "user",
        content: `Write example about ${use_case} using propperly words about ${topic}, that targets the following topic: ${keywords} and using ${categorytype}. The content should be formatted in HTML,
        limited to the following HTML tags: br, p, h1, h2, h3, h4, h5, h6, li, ol, ul, i `,
      },
    ],
  });

  const postContent = postContentResponse.data.choices[0]?.message?.content || "";

  const titleResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You are a ${use_case} generator`,
      },
      {
        role: "user",
        content: `Write about ${use_case} and propperly about ${topic}, that targets the following topic: ${keywords} and using  ${categorytype}. The content should be formatted in HTML,
        limited to the following HTML tags `,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content: `Generate an appropriate title or subject text for the above ${use_case}`,
      },
    ],
  });

  const title = titleResponse.data.choices[0]?.message?.content || "";

  const metaDescriptionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You are a ${use_case} generator`,
      },
      {
        role: "user",
        content: `Write brief information ${use_case} and propperly words about ${topic} only three or two senteces, that targets the following topic: ${keywords} and using ${categorytype}.`,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content: `Generate an appropriate short description text for the above ${use_case}`,
      },
    ],
  });

  const metaDescription = metaDescriptionResponse.data.choices[0]?.message?.content || "";

  console.log("Post Content: ", postContent);
  console.log("Title: ", title);
  console.log("Meta Description: ", metaDescription);

  // ...
  await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  );

  // Insert a new document into the "posts" collection
  const post = await db.collection("posts").insertOne({
    // Set the post content, title, and meta description from the generated responses
    postContent: postContent,
    title: title,
    metaDescription: metaDescription,
    // Set the topic and keywords from the request body
    use_case: use_case,
    topic: topic,
    keywords: keywords,
    categorytype: categorytype,
    // Set the user ID from the userProfile object and current date
    userId: userProfile._id,
    created: new Date(),
  });

  // Log the newly inserted post object
  console.log("POST:", post);

  // Respond with a status of 200 and send the postId in the JSON response
  res.status(200).json({
    postId: post.insertedId,
  });
});
