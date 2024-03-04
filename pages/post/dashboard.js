// RUN: npm run dev
// URL: http://localhost:3000

// Import necessary modules and components
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import React, { useEffect } from "react";
import Image from "next/image";
import { Logo } from "../../components/Logo";
import Link from "next/link";

// image card
import cardImage from "../../public/hero.webp";
import cardImage1 from "../../public/image_blog.png";
import cardImage2 from "../../public/image_brand_name.png";
import cardImage3 from "../../public/image_business_ideas.png";
import cardImage4 from "../../public/image_cover_letter.png";
import cardImage5 from "../../public/image_email.png";
import cardImage6 from "../../public/image_email_reply.png";
import cardImage7 from "../../public/image_job_description.png";
import cardImage8 from "../../public/image_legal_agreement.png";
import cardImage9 from "../../public/image_post_caption_ideas.png";
import cardImage10 from "../../public/image_product_description.png";
import cardImage11 from "../../public/image_proposal_letter.png";
import cardImage12 from "../../public/image_review.png";
import cardImage13 from "../../public/image_review_feedback.png";
import cardImage14 from "../../public/image_social_media_ads.png";
import cardImage15 from "../../public/image_story_plot.png";
import cardImage16 from "../../public/image_birthday_wish.png";

const useCases = [
  {
    heading: "Blog",
    description: "Blog",
    image: cardImage1,
  },
  {
    heading: "Brand Name",
    description: "Brand Name",
    image: cardImage2,
  },
  {
    heading: "Business Ideas",
    description: "Business Ideas",
    image: cardImage3,
  },
  {
    heading: "Cover Letter",
    description: "Cover Letter",
    image: cardImage4,
  },
  {
    heading: "Email",
    description: "Write Email",
    image: cardImage5,
  },
  {
    heading: "Email Reply",
    description: "Write Email Reply",
    image: cardImage6,
  },
  {
    heading: "Job Description",
    description: "Job Description",
    image: cardImage7,
  },
  {
    heading: "Legal Agreement",
    description: "Legal Agreement",
    image: cardImage8,
  },
  {
    heading: "Post and Caption Ideas",
    description: "Post and Caption Ideas",
    image: cardImage9,
  },
  {
    heading: "Product Description",
    description: "Product Description",
    image: cardImage10,
  },
  {
    heading: "Proposal Letter",
    description: "Proposal Letter",
    image: cardImage11,
  },
  {
    heading: "Review",
    description: "Review",
    image: cardImage12,
  },
  {
    heading: "Review Feedback",
    description: "Review Feedback",
    image: cardImage13,
  },
  {
    heading: "Social Media Ads",
    description: "Social Media advertisement",
    image: cardImage14,
  },
  {
    heading: "Story Plot",
    description: "Story Plot",
    image: cardImage15,
  },
  {
    heading: "Wish Birthday",
    description: "Birthday Wish",
    image: cardImage16,
  },
];

// Daftar warna yang akan digunakan untuk tombol "Try here"
const buttonColors = [
  "bg-blue-500",
  "bg-red-500",
  "bg-emerald-500",
  "bg-gray-400",
  "bg-teal-500",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-orange-600",
  "bg-red-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-blue-400",
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-pink-500",
];

// Define the 'newPost' component
export default function NewPost(props) {
  // Initialize router and state variables
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [useCase, setUseCase] = useState("");
  const [keywords, setKeywords] = useState("");
  const [briefDesc, setBriefDesc] = useState("");
  const [readerAge, setReaderAge] = useState(""); // Untuk age of readers
  const [categoryType, setCategoryType] = useState(""); // Untuk methodology of language application
  const [generating, setGenerating] = useState(false);

  // Define a function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      // Path API default
      let apiUrl = "/api/generatePost";
      // Jika useCase bukan "Blog"
      if (useCase !== "Blog") {
        apiUrl = "/api/generateContent";
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ useCase, topic, keywords, categoryType }),
      });

      const json = await response.json();

      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (e) {
      setGenerating(false);
    }
  };

  // Render the component
  return (
    <div className="h-full overflow-hidden">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <h2 className="flex items-center justify-center space-x-2">
          <span className="text-yellow-500 text-2xl mr-3">★</span>
          PICK A USE CASE
          <span className="text-yellow-500 text-2xl ml-5">★</span>
        </h2>
        <div className="w-full max-h-screen overflow-y-auto gap-4 flex-wrap flex justify-center items-center p-5" style={{ paddingBottom: 9 + "em" }}>
          {/* Card  */}
          {useCases.map((useCase, index) => (
            <Card key={index} useCase={useCase} onSubmit={(e) => handleSubmit(e, useCase, buttonColors[index])} buttonColor={buttonColors[index]} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ useCase, onSubmit, buttonColor }) {
  const { heading, description, image } = useCase;
  const router = useRouter();

  const handleTryHereClick = () => {
    router.push({
      pathname: "/post/new",
      query: { use_case: description }, // using 'use_case' as query parameter
    });
  };

  return (
    <div className="w-60 p-2 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
      <Image src={image} alt={heading} className="h-40 object-cover rounded-xl" />
      <div className="p-2">
        <h2 className="font-bold text-lg mb-2">{heading}</h2>
        <p className="text-sm text-gray-600">Automatically generate text for creating {description} </p>
      </div>
      <input type="hidden" className="bg-gray-200 text-gray-600" value={description}></input>
      <div className="m-2">
        <button href="/post/new" onClick={handleTryHereClick} className={`text-white ${buttonColor} px-3 py-1 rounded-md hover:${buttonColor}-dark`}>
          Try Here
        </button>
      </div>
    </div>
  );
}
// Define the layout for the 'newPost' component
NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

// Define server-side props with authentication
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      // Redirect to the token top-up page if tokens are not available
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false,
        },
      };
    }

    return {
      props,
    };
  },
});

// <a href="https://www.freepik.com/free-photo/brand-price-tags-style-graphics_16441403.htm#query=brand%20name&position=13&from_view=search&track=ais">Image by rawpixel.com</a> on Freepik
