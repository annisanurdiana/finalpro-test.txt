import React, { useCallback, useReducer, useState } from "react";

const PostsContext = React.createContext({});

export default PostsContext;

// Define a reducer function to handle state updates
function postReducer(state, action) {
  switch (action.type) {
    // When new posts are added
    case "addPosts": {
      const newPosts = [...state];
      action.posts.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    // When a post is deleted
    case "deletePost": {
      const newPosts = [];
      state.forEach((post) => {
        if (post._id !== action.postId) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    default:
      return state;
  }
}

// PostsProvider component
export const PostsProvider = ({ children }) => {
  // const [posts, setPosts] = useState([]);
  const [posts, dispatch] = useReducer(postReducer, []); // Use reducer to manage state
  const [noMorePosts, setNoMorePosts] = useState(false);

  // Callback function to delete a post
  const deletePost = useCallback((postId) => {
    dispatch({
      type: "deletePosts",
      postId,
    });

    // setPosts((value) => {
    //   const newPosts = [];
    //   value.forEach((post) => {
    //     if (post._id !== postId) {
    //       newPosts.push(post);
    //     }
    //   });
    //   return newPosts;
    // });
  }, []);

  // Callback function to set posts from server-side rendering (SSR)
  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    dispatch({
      type: "addPosts",
      posts: postsFromSSR,
    });

    // console.log("POSTS FROM SSR: ", postsFromSSR);
    // //setPosts(postsFromSSR);
    // setPosts((value) => {
    //   const newPosts = [...value];
    //   postsFromSSR.forEach((post) => {
    //     const exists = newPosts.find((p) => p._id === post._id);
    //     if (!exists) {
    //       newPosts.push(post);
    //     }
    //   });
    //   return newPosts;
    // });
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

    // if (postsResult.length < 5) {
    //   setNoMorePosts(true);
    // }

    dispatch({
      type: "addPosts",
      posts: postsResult,
    });

    // setPosts((value) => {
    //   const newPosts = [...value];
    //   postsResult.forEach((post) => {
    //     const exists = newPosts.find((p) => p._id === post._id);
    //     if (!exists) {
    //       newPosts.push(post);
    //     }
    //   });
    //   return newPosts;
    // });
  }, []);

  // The PostsProvider component provides the posts state, setPostsFromSSR, getPosts,
  // ...noMorePosts, and deletePost functions through the PostsContext
  return <PostsContext.Provider value={{ posts, setPostsFromSSR, getPosts, noMorePosts, deletePost }}> {children} </PostsContext.Provider>;
};
