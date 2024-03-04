import React, { useCallback, useState } from "react";

// Create a new context for the PostsContext
const PostsContext = React.createContext({});
export default PostsContext;

// PostsProvider component
export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]); // State for storing posts
  const [noMorePosts, setNoMorePosts] = useState(false); // indicate if there are no more posts

  // Callback function to delete a post by its ID
  const deletePost = useCallback((postId) => {
    setPosts((value) => {
      const newPosts = [];
      value.forEach((post) => {
        if (post._id !== postId) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
  }, []);

  // Callback function to set the posts from server-side rendering (SSR)
  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    console.log("POSTS FROM SSR: ", postsFromSSR);
    setPosts((value) => {
      const newPosts = [...value];
      postsFromSSR.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
  }, []);

  // Callback function to fetch posts from the server and update the posts state
  const getPosts = useCallback(async ({ lastPostDate, getNewerPosts = false }) => {
    const result = await fetch(`/api/getPosts`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ lastPostDate, getNewerPosts }),
    });
    const json = await result.json();
    const postsResult = json.posts || [];

    console.log("POST RESULT: ", postsResult);

    setPosts((value) => {
      const newPosts = [...value];
      postsResult.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
  }, []);

  // Render the PostsContext.Provider and provide the necessary values
  return <PostsContext.Provider value={{ posts, setPostsFromSSR, getPosts, noMorePosts, deletePost }}>{children}</PostsContext.Provider>;
};
