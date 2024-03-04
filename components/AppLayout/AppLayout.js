// Import necessary dependencies
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faIcons } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo";
import { useContext, useEffect } from "react";
import PostsContext from "../../context/postsContext";

// AppLayout component
export const AppLayout = ({ children, availableTokens, posts: postsFromSSR, postId, postCreated }) => {
  const { user } = useUser(); // Access the authenticated user
  const { setPostsFromSSR, posts, getPosts, noMorePosts } = useContext(PostsContext); // Access posts context

  useEffect(() => {
    // Update posts from server-side rendering
    setPostsFromSSR(postsFromSSR);

    // Check if the specified postId exists in the posts from server-side rendering
    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId);

      if (!exists) {
        // If the post does not exist, fetch newer posts
        getPosts({ getNewerPosts: true, lastPostDate: postCreated });
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, postCreated, getPosts]);

  //console.log("User:", user);
  //console.log("App Props:", rest);

  return (
    <div className="grid grid-cols-[296px_1fr] h-screen max-h-screen ">
      <div className="flex flex-col text-white overflow-hidden bg-pink-200">
        <div className="bg-purple-900 px-2">
          <Logo></Logo>
          <Link href="/post/dashboard" className="btn">
            {" "}
            New Create
          </Link>

          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-400"></FontAwesomeIcon>
            <span className="pl-1">{availableTokens} Tokens Available</span>
          </Link>
        </div>

        <div className="px-3 flex-1 overflow-auto bg-gradient-to-b from-purple-900 to-pink-600">
          {posts.map((post) => (
            <Link
              key={post._id}
              //href={`/post/${post._id}`}
              href={{
                pathname: `/post/${post._id}`,
                query: { use_case: post.use_case },
              }}
              className={`mt-1 py-1 text-sm border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
                postId === post._id ? " border-white bg-white/30" : ""
              } `}
            >
              {post.use_case}: {post.topic}
            </Link>
          ))}
          {!noMorePosts && (
            <div
              onClick={() => {
                if (posts && posts.length > 0) {
                  getPosts({ lastPostDate: posts[posts.length - 1].created });
                } else {
                  window.alert("Tidak ada postingan yang tersedia.");
                }
              }}
              className="hover:underline text-sm text-slate-100 text-center cursor-pointer mt-4"
            >
              Load More ...
            </div>
          )}
        </div>

        <div className="bg-pink-600 flex items-center gap-2 border-t border-t-white/30 h-20 px-2">
          {!!user ? (
            <>
              <div>
                <Image src={user.picture} alt={user.name} height={50} width={50} className="rounded-full" />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login"> Login </Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
