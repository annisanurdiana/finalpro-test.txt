import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { getAppProps } from "../../utils/getAppProps";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

import PostsContext from "../../context/postsContext";
import PostContentEditor from "../api/PostContentEditor"; // Impor komponen PostContentEditor

// Impor komponen PostContentEditor

export default function Post(props) {
  const router = useRouter();
  const { isBlogUseCase } = props;
  const { use_case, setUse_case } = router.query; // Mengambil nilai 'use_case' dari query parameter

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deletePost } = useContext(PostsContext);
  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitles, setEditedTitles] = useState({});
  const [editingMetaDescription, setEditingMetaDescription] = useState(false);
  const [editedMetaDescriptions, setEditedMetaDescriptions] = useState({});
  const [editingContent, setEditingContent] = useState(false);
  const [editedContent, setEditedContent] = useState({});

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/deletePost`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ postId: props.id }),
      });
      const json = await response.json();
      if (json.success) {
        deletePost(props.id);
        router.replace(`/post/dashboard`);
      }
    } catch (e) {}
  };

  const handleTitleEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/editPostTitle`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ postId: props.id, editedTitle: editedTitles[props.id] }),
      });

      if (response.ok) {
        setEditing(false); // Menutup mode editing judul

        router.replace(router.asPath); // Memperbarui halaman
      }
    } catch (error) {
      console.error("Gagal menyimpan judul yang diedit:", error);
    }
  };

  const handleMetaDescriptionEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/editPostMetaDescription`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ postId: props.id, editedMetaDescription: editedMetaDescriptions[props.id] }),
      });

      if (response.ok) {
        setEditingMetaDescription(false);
        router.replace(router.asPath);
      }
    } catch (error) {
      console.error("Error saving edited meta description:", error);
    }
  };

  const handleContentEdit = async () => {
    try {
      const response = await fetch(`/api/editPostContent`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ postId: props.id, editedContent: editedContent[props.id] }),
      });

      if (response.ok) {
        setEditingContent(false);
        router.replace(router.asPath);
        // Perbarui konten di state jika perlu
        //setEditedContent(router.asPath); // Menambahkan perubahan ke state
      }
    } catch (error) {
      console.error("Error saving edited content:", error);
    }
  };

  // const handleCancelEdit = () => {
  //   // Set editedContent kembali ke konten asli
  //   setEditedContent(props.postContent);
  //   // Keluar dari mode editing
  //   setEditingContent(false);
  // };

  return (
    <div className="overflow-auto h-full ">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Subject / Title &nbsp;||
          <span className="cursor-pointer text-blue-800" onClick={() => setEditing(true)}>
            &nbsp; Edit
          </span>
        </div>
        {/* Tampilkan bagian ini hanya jika use case adalah "Blog" */}
        <div className="p-4 my-2 border border-stone-200 rounded-sm">
          {/* Tampilkan form pengeditan judul jika sedang dalam mode pengeditan */}
          {editing ? (
            <form onSubmit={handleTitleEdit} className="flex flex-col items-center">
              <textarea
                className="resize-none text-purple-600 text-2xl font-bold cursor-pointer border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                maxLength={100}
                type="text"
                value={editedTitles[props.id] || props.title}
                onChange={(e) => setEditedTitles({ ...editedTitles, [props.id]: e.target.value })}
              />
              <div className="flex my-2 mt-1 mb-3">
                <button className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold py-1 px-4 rounded mr-1">Save</button>
                <button className="bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 font-bold py-1 px-4 rounded ml-1" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-purple-600 text-2xl font-bold">{props.title}</div>
          )}
        </div>

        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Brief / Meta Description &nbsp;||
          <span className="cursor-pointer text-blue-800" onClick={() => setEditingMetaDescription(true)}>
            &nbsp; Edit
          </span>
        </div>
        {/* Tampilkan bagian ini hanya jika use case adalah "Blog" */}
        <div className="p-4 my-2 border border-stone-200 rounded-sm">
          <div className="mt-2">
            {/* Tampilkan form pengeditan meta deskripsi jika sedang dalam mode pengeditan */}
            {editingMetaDescription ? (
              <form onSubmit={handleMetaDescriptionEdit} className="flex flex-col items-center">
                <textarea
                  className="resize-none text-sm cursor-pointer border border-slate-500 w-full block my-1 px-5 py-5 rounded-sm"
                  rows={4}
                  value={editedMetaDescriptions[props.id] || props.metaDescription}
                  onChange={(e) => setEditedMetaDescriptions({ ...editedMetaDescriptions, [props.id]: e.target.value })}
                />

                <div className="flex my-2 mt-2 mb-2">
                  <button className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold py-1 px-4 rounded mr-1">Save</button>
                  <button className="bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 font-bold py-1 px-4 rounded ml-1" onClick={() => setEditingMetaDescription(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Tampilkan meta deskripsi jika tidak dalam mode pengeditan
              // <div className="cursor-pointer" onClick={() => setEditingMetaDescription(true)}>
              //   {props.metaDescription}
              // </div>
              <div>{props.metaDescription}</div>
            )}
          </div>
        </div>

        {/* Tampilkan bagian ini hanya jika use case adalah "Blog" */}
        {use_case === "Blog" && (
          <div>
            <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">Keywords</div>
            <div className="flex flex-wrap pt-2 gap-1">
              {props.keywords.split(",").map((keyword, i) => (
                <div key={i} className="p-3 rounded-full bg-purple-800 text-white">
                  {keyword}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm mt-6 p-2 bg-stone-200 rounded-sm">
          <p className="font-bold">
            {" "}
            Content of Use Case &nbsp;||
            <span className="cursor-pointer text-blue-800" onClick={() => setEditingContent(true)}>
              &nbsp; Edit HTML
            </span>
          </p>
        </div>
        {editingContent ? (
          <form onSubmit={handleContentEdit}>
            <textarea
              className="resize-none text-sm cursor-pointer border border-slate-500 w-full block my-1 px-5 py-5 rounded-sm"
              rows={14}
              value={editedContent[props.id] || props.postContent}
              onChange={(e) => setEditedContent({ ...editedContent, [props.id]: e.target.value })}
            />
            <div className="flex my-2 mt-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-1">Save</button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-1" onClick={() => setEditingContent(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div dangerouslySetInnerHTML={{ __html: props.postContent }} />
          </div>
        )}

        <div className="my-4">
          {!showDeleteConfirm && (
            <button className="btn bg-red-600 btn-sm hover:bg-red-800" onClick={() => setShowDeleteConfirm(true)}>
              Delete Post
            </button>
          )}
          {!!showDeleteConfirm && (
            <div>
              <p className="p-2 bg-red-200 text-center">Are you sure you want to delete this post?</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="btn bg-stone-400 hover:bg-stone-600" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
                <button className="btn bg-red-600 hover:bg-red-800" onClick={handleDeleteConfirm}>
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("GeneratorApp");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        id: ctx.params.postId,
        postContent: post.postContent || "", // Jika post.postContent adalah null, gunakan string kosong ('')
        title: post.title || "", // Jika post.title adalah null, gunakan string kosong ('')
        metaDescription: post.metaDescription || "", // Jika post.metaDescription adalah null, gunakan string kosong ('')
        keywords: post.keywords || "", // Jika post.keywords adalah null, gunakan string kosong ('')
        categorytype: post.categorytype || "", // Jika post.categorytype adalah null, gunakan string kosong ('')
        postCreated: post.created ? post.created.toString() : "", // Jika post.created adalah null, gunakan string kosong ('')
        //categorytype: post.categorytype,
        // ...(use_case === "BLOG" ? { languageType: post.languageType } : {}), // Tambahkan kondisi ini
        ...props,
      },
    };
  },
});
