// RUN: npm run dev
// URL: http://localhost:3000

// Import necessary modules and components
import Link from "next/link";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faL } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";

const useCases = [
  {
    label: "Wish Birthday",
    value: "Birthday Wish",
  },
  {
    label: "Blog",
    value: "Blog",
  },
  {
    label: "Brand Name",
    value: "Brand Name",
  },
  {
    label: "Business Ideas",
    value: "Business Ideas",
  },
  {
    label: "Cover Letter",
    value: "Cover Letter",
  },
  {
    label: "Email",
    value: "Write Email",
  },
  {
    label: "Email Reply",
    value: "Write Email Reply",
  },
  {
    label: "Job Description",
    value: "Job Description",
  },
  {
    label: "Legal Agreement",
    value: "Legal Agreement",
  },
  {
    label: "Post and Caption Ideas",
    value: "Post and Caption Ideas",
  },
  {
    label: "Product Description",
    value: "Product Description",
  },
  {
    label: "Proposal Letter",
    value: "Proposal Letter",
  },
  {
    label: "Review",
    value: "Review",
  },
  {
    label: "Review Feedback",
    value: "Review Feedback",
  },
  {
    label: "Social Media Ads",
    value: "Social Media advertisement",
  },
  {
    label: "Story Plot",
    value: "Story Plot",
  },
];

// Urutkan opsi berdasarkan label
useCases.sort((a, b) => (a.label > b.label ? 1 : -1));

// Define the 'newPost' component
export default function newPost(props) {
  // Initialize router and state variables
  const router = useRouter();
  const { use_case, setUse_case } = router.query; // Mengambil nilai 'use_case' dari query parameter
  const [topic, setTopic] = useState("");
  //const [use_case, setUse_case] = useState("");
  const [keywords, setKeywords] = useState("");
  //const [briefDesc, setBriefDesc] = useState("");
  //const [readerAge, setReaderAge] = useState(""); // Untuk age of readers
  const [categorytype, setCategoryType] = useState(""); // Untuk methodology of language application
  const [generating, setGenerating] = useState(false);

  // Define a function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      let apiUrl = "/api/generatePost"; // Path API default

      if (use_case !== "Blog") {
        apiUrl = "/api/generateContent"; // Jika use_case bukan "Blog", gunakan path yang berbeda
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ use_case, topic, keywords, categorytype }),
      });

      const json = await response.json();

      if (json?.postId) {
        // Redirect ke halaman post yang baru dihasilkan
        // if (use_case !== "Blog") {
        //   console.log("Post Content: ", json);
        // } else {
        //   router.push(`/post/${json.postId}`);
        // }
        //router.push(`/post/${json.postId}`);
        router.push({
          pathname: `/post/${json.postId}`,
          query: { use_case: use_case }, // Menggunakan 'use_case' sebagai query parameter
        });
      }
    } catch (e) {
      setGenerating(false);
    }
  };

  // const textToSpeak = "This is an example oh Text to Speak, click start to countinue....";

  // const [isPlaying, setIsPlaying] = useState(false);

  // const speakText = () => {
  //   const utterance = new SpeechSynthesisUtterance(textToSpeak);
  //   speechSynthesis.speak(utterance);
  //   setIsPlaying(true); // Set state untuk menandakan bahwa suara sedang diputar
  // };

  // useEffect(() => {
  //   if (isPlaying) {
  //     // Hentikan suara saat komponen unmount
  //     return () => {
  //       speechSynthesis.cancel();
  //     };
  //   }
  // }, [isPlaying]);

  // Render the component
  return (
    <div className="h-full overflow-hidden">
      {/* <div>
        <p>This is an example oh Text to Speak, click start to countinue....</p>
        <button className="btn border-t-cyan-200" onClick={speakText}>
          Play Text
        </button>
      </div> */}
      {!!generating && (
        // Display a loading message when generating content
        <div className="text-pink-500 flex h-full animate-pulse w-full flex-col justify-center items-center ">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>Generating... </h6>
        </div>
      )}
      {!generating && (
        // Display the content generation form when not generating
        <div className="w-full h-full flex flex-col overflow-auto ">
          <form onSubmit={handleSubmit} className="m-auto w-full max-w-screen-sm bg-black/10 p-4 roun shadow-xl border border-slate-200 shadow-slate-200 ">
            {/* Select Use Case */}
            <div>
              <label>
                <strong>Use Case:</strong>
              </label>
              {use_case ? (
                <input
                  type="text"
                  className="border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={use_case}
                  readOnly // Membuat input hanya baca
                />
              ) : (
                <select className="border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={use_case} onChange={(e) => setUse_case(e.target.value)}>
                  <option disabled selected value="">
                    Select an Option
                  </option>
                  {useCases.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <br></br>
            {/* Input Topic*/}
            {use_case === "Birthday Wish" && (
              <div>
                <label>
                  <strong>Birthday greeting recipient name:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: My beloved sister Annisa Nurdiana"
                  readOnly={use_case !== "Birthday Wish"}
                />
              </div>
            )}

            {use_case === "Blog" && (
              <div>
                <label>
                  <strong>Generate a content on the topic of:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  maxLength={150}
                  placeholder="This is the subject or topic that will be discussed in the blog, example: 'Healthy Eating Habits'..."
                  readOnly={use_case !== "Blog"}
                />
              </div>
            )}

            {use_case === "Brand Name" && (
              <div>
                <label>
                  <strong>The type of business or industry:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: Fashion Retail..."
                  readOnly={use_case !== "Brand Name"}
                />
              </div>
            )}

            {use_case === "Business Ideas" && (
              <div>
                <label>
                  <strong>The type of business:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: Culinary"
                  readOnly={use_case !== "Business Ideas"}
                />
              </div>
            )}

            {use_case === "Cover Letter" && (
              <div>
                <label>
                  <strong>The company name to apply for:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: Indo Motor Corp..."
                  readOnly={use_case !== "Cover Letter"}
                />
              </div>
            )}

            {use_case === "Write Email" && (
              <div>
                <label>
                  <strong>The email address of the recipient:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: For recipient's name is annisanurdiana@example.com"
                  readOnly={use_case !== "Write Email"}
                />
              </div>
            )}

            {use_case === "Write Email Reply" && (
              <div>
                <label>
                  <strong>The email address of the recipient:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: For recipient's name is annisanurdiana@example.com"
                  readOnly={use_case !== "Write Email Reply"}
                />
              </div>
            )}

            {use_case === "Job Description" && (
              <div>
                <label>
                  <strong>The job position that needs to be filled:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: Front-End Developer"
                  readOnly={use_case !== "Job Description"}
                />
              </div>
            )}

            {use_case === "Legal Agreement" && (
              <div>
                <label>
                  <strong>The type of agreement:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: Employment Contract..."
                  readOnly={use_case !== "Legal Agreement"}
                />
              </div>
            )}

            {use_case === "Post and Caption Ideas" && (
              <div>
                <label>
                  <strong>The type of content:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: Travel Photography..."
                  readOnly={use_case !== "Post and Caption Ideas"}
                />
              </div>
            )}

            {use_case === "Product Description" && (
              <div>
                <label>
                  <strong>The name of the product being described:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: SuperFit Protein Shake"
                  readOnly={use_case !== "Product Description"}
                />
              </div>
            )}

            {use_case === "Proposal Later" && (
              <div>
                <label>
                  <strong>The name of the company or organization submitting the proposal:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: PT XYZ Consulting"
                  readOnly={use_case !== "Proposal Later"}
                />
              </div>
            )}

            {use_case === "Review" && (
              <div>
                <label>
                  <strong>The name of the product or service being reviewed:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: XYZ Smartphone"
                  readOnly={use_case !== "Review"}
                />
              </div>
            )}

            {use_case === "Review Feedback" && (
              <div>
                <label>
                  <strong>The name of review recipient:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: Product Team"
                  readOnly={use_case !== "Review Feedback"}
                />
              </div>
            )}

            {use_case === "Social Media advertisement" && (
              <div>
                <label>
                  <strong>The name of the company or organization submitting the proposal:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: PT XYZ Consulting"
                  readOnly={use_case !== "Social Media advertisement"}
                />
              </div>
            )}

            {use_case === "Story Plot" && (
              <div>
                <label>
                  <strong>The type of story genre:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: Fantasy..."
                  readOnly={use_case !== "Story Plot"}
                />
              </div>
            )}

            {/*  =====================  */}

            {/* CATEGORY */}

            {use_case === "Birthday Wish" && (
              <div>
                <label>
                  <strong>The age of the person celebrating their birthday:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={categorytype}
                  onChange={(e) => setCategoryType(e.target.value)}
                  type="number"
                  maxLength={100}
                  placeholder="Example: 17"
                  readOnly={use_case !== "Birthday Wish"}
                />
              </div>
            )}

            {use_case === "Blog" && (
              <div>
                <label>
                  <strong>The target language to be conveyed:</strong>
                </label>
                <div className="flex items-center pl-4 border rounded">
                  <input
                    type="radio"
                    value="for children with fun language"
                    name="age"
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="w-4 h-4 dark:ring-offset-gray-800 focus:ring-2"
                    readOnly={use_case !== "Blog"}
                  />
                  <label htmlFor="age-child" className="w-full py-4 ml-2 text-sm font-medium">
                    Child (under 12)
                  </label>

                  <input type="radio" value="for teenagers with casual language" name="age" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Blog"} />
                  <label htmlFor="age-teenager" className="w-full py-4 ml-2 text-sm font-medium">
                    Teenager (12-17)
                  </label>

                  <input type="radio" value="for adults with proper language" name="age" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Blog"} />
                  <label htmlFor="age-adult" className="w-full py-4 ml-2 text-sm font-medium">
                    Adult (17+)
                  </label>

                  <input type="radio" value="for all ages with simple language" name="age" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Blog"} defaultChecked />
                  <label htmlFor="age-all" className="w-full py-4 ml-2 text-sm font-medium">
                    All
                  </label>
                </div>
              </div>
            )}

            {use_case === "Brand Name" && (
              <div>
                <label>
                  <strong>The qualities, values, and perception the brand aims to convey:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={categorytype}
                  onChange={(e) => setCategoryType(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Brand Name"}
                  placeholder="Example: Values and Image are Elegance and Modernity"
                />
              </div>
            )}

            {use_case === "Business Ideas" && (
              <div>
                <label>
                  <strong>The demographic or group of people the business intends to serve:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={`Target Market: ${categorytype}`}
                  onChange={(e) => setCategoryType(e.target.value.replace("Target Market: ", ""))}
                  maxLength={200}
                  readOnly={use_case !== "Business Ideas"}
                  placeholder="Example: Health-conscious individuals"
                />
              </div>
            )}

            {use_case === "Cover Letter" && (
              <div>
                <label>
                  <strong>The job position you are seeking:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={`Position Applied For: ${categorytype}`}
                  onChange={(e) => setCategoryType(e.target.value.replace("Position Applied For: ", ""))}
                  maxLength={200}
                  readOnly={use_case !== "Cover Letter"}
                  placeholder="Example: Software Engineer"
                />
              </div>
            )}

            {use_case === "Write Email" && (
              <div>
                <label>
                  <strong>The subject or title of the email:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={`Email Subject: ${categorytype}`}
                  onChange={(e) => setCategoryType(e.target.value.replace("Email Subject: ", ""))}
                  maxLength={200}
                  readOnly={use_case !== "Write Email"}
                  placeholder="Example: Important Announcement"
                />
              </div>
            )}

            {use_case === "Write Email Reply" && (
              <div>
                <label>
                  <strong>The target language to be conveyed:</strong>
                </label>
                <div className="flex items-center pl-4 border rounded">
                  <input
                    type="radio"
                    value="with formal languange"
                    name="language"
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="w-4 h-4 dark:ring-offset-gray-800 focus:ring-2"
                    defaultChecked
                    readOnly={use_case !== "Write Email Reply"}
                  />
                  <label htmlFor="formal-language" className="w-full py-4 ml-2 text-sm font-medium">
                    Formal
                  </label>

                  <input type="radio" value="with technical languange" name="language" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Write Email Reply"} />
                  <label htmlFor="technical language" className="w-full py-4 ml-2 text-sm font-medium">
                    Technical
                  </label>

                  <input type="radio" value="with casual language" name="language" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Write Email Reply"} />
                  <label htmlFor="standard" className="w-full py-4 ml-2 text-sm font-medium">
                    Casual
                  </label>

                  <input type="radio" value="with fancy language" name="language" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Write Email Reply"} />
                  <label htmlFor="age-all" className="w-full py-4 ml-2 text-sm font-medium">
                    Fancy
                  </label>
                </div>
              </div>
            )}

            {use_case === "Job Description" && (
              <div>
                <label>
                  <strong>The primary tasks and duties associated with the position:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={`Main Responsibilities: ${categorytype}`}
                  onChange={(e) => setCategoryType(e.target.value.replace("Main Responsibilities: ", ""))}
                  maxLength={200}
                  readOnly={use_case !== "Job Description"}
                  placeholder="Developing the front-end of web applications"
                />
              </div>
            )}

            {use_case === "Legal Agreement" && (
              <div>
                <label>
                  <strong>The party involved in the agreement:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={categorytype}
                  onChange={(e) => setCategoryType(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Legal Agreement"}
                  placeholder="Example: Party One is Property Owner and Party Two is Tenant..."
                />
              </div>
            )}

            {use_case === "Post and Caption Ideas" && (
              <div>
                <label>
                  <strong>Suggestions for the content of your social media post:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={`Post Ideas: ${categorytype}`}
                  onChange={(e) => setCategoryType(e.target.value.replace("Post Ideas: ", ""))}
                  maxLength={200}
                  readOnly={use_case !== "Post and Caption Ideas"}
                  placeholder="Example: Beautiful photos of local travel destinations."
                />
              </div>
            )}

            {use_case === "Product Description" && (
              <div>
                <label>
                  <strong>A brief description of the product:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={`Product Description: ${categorytype}`}
                  onChange={(e) => setCategoryType(e.target.value.replace("Product Description: ", ""))}
                  maxLength={200}
                  readOnly={use_case !== "Product Description"}
                  placeholder="Example: A nutritious protein shake for a healthy lifestyle."
                />
                <small className="block mb-2">Max 200 words</small>
              </div>
            )}

            {use_case === "Proposal Later" && (
              <div>
                <label>
                  <strong>The main purpose or objective of your proposal:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={`Proposal Later: ${categorytype}`}
                  onChange={(e) => setCategoryType(e.target.value.replace("Proposal Later: ", ""))}
                  maxLength={200}
                  readOnly={use_case !== "Proposal Later"}
                  placeholder="Proposal Objective: Business Collaboration."
                />
                <small className="block mb-2">Max 200 words</small>
              </div>
            )}

            {use_case === "Review" && (
              <div>
                <label>
                  <strong>The target language to be conveyed:</strong>
                </label>
                <div className="flex items-center pl-4 border rounded">
                  <input
                    type="radio"
                    value="with formal languange"
                    name="language"
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="w-4 h-4 dark:ring-offset-gray-800 focus:ring-2"
                    defaultChecked
                    readOnly={use_case !== "Review"}
                  />
                  <label htmlFor="formal-language" className="w-full py-4 ml-2 text-sm font-medium">
                    Formal
                  </label>

                  <input type="radio" value="with technical languange" name="language" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Review"} />
                  <label htmlFor="technical language" className="w-full py-4 ml-2 text-sm font-medium">
                    Technical
                  </label>

                  <input type="radio" value="with casual language" name="language" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Review"} />
                  <label htmlFor="standard" className="w-full py-4 ml-2 text-sm font-medium">
                    Casual
                  </label>

                  <input type="radio" value="with fancy language" name="language" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Review"} />
                  <label htmlFor="age-all" className="w-full py-4 ml-2 text-sm font-medium">
                    Fancy
                  </label>
                </div>
              </div>
            )}

            {use_case === "Review Feedback" && (
              <div>
                <label>
                  <strong>The target language to be conveyed:</strong>
                </label>
                <div className="flex items-center pl-4 border rounded">
                  <input
                    type="radio"
                    value="with formal languange"
                    name="language"
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="w-4 h-4 dark:ring-offset-gray-800 focus:ring-2"
                    defaultChecked
                    readOnly={use_case !== "Review Feedback"}
                  />
                  <label htmlFor="formal-language" className="w-full py-4 ml-2 text-sm font-medium">
                    Formal
                  </label>

                  <input type="radio" value="with technical languange" name="language" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Review Feedback"} />
                  <label htmlFor="technical language" className="w-full py-4 ml-2 text-sm font-medium">
                    Technical
                  </label>

                  <input type="radio" value="with casual language" name="language" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Review Feedback"} />
                  <label htmlFor="standard" className="w-full py-4 ml-2 text-sm font-medium">
                    Casual
                  </label>

                  <input type="radio" value="with fancy language" name="language" onChange={(e) => setCategoryType(e.target.value)} readOnly={use_case !== "Review Feedback"} />
                  <label htmlFor="age-all" className="w-full py-4 ml-2 text-sm font-medium">
                    Fancy
                  </label>
                </div>
              </div>
            )}

            {use_case === "Social Media advertisement" && (
              <div>
                <label>
                  <strong>The goal or purpose of your social media advertisement:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={`Ad Objective: ${categorytype}`}
                  onChange={(e) => setCategoryType(e.target.value.replace("Ad Objective: ", ""))}
                  maxLength={200}
                  readOnly={use_case !== "Social Media advertisement"}
                  placeholder="Example: Promote our latest fashion collection..."
                />
              </div>
            )}

            {use_case === "Story Plot" && (
              <div>
                <label>
                  <strong>Description of the central character in your story:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={`Main Character: ${categorytype}`}
                  onChange={(e) => setCategoryType(e.target.value.replace("Main Character: ", ""))}
                  maxLength={200}
                  readOnly={use_case !== "Story Plot"}
                  placeholder="Example: A young wizard..."
                />
              </div>
            )}

            {/*  =====================  */}

            {/* Input Keywords */}
            {use_case === "Birthday Wish" && (
              <div>
                <label>
                  <strong>A heartfelt birthday wish or message:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  type="text"
                  maxLength={200}
                  readOnly={use_case !== "Birthday Wish"}
                  placeholder="Example: Happy birthday, may all your dreams come true!"
                />
                <small className="block mb-2">Max 200 words</small>
              </div>
            )}

            {use_case === "Blog" && (
              <div>
                <label>
                  <strong>Targeting the following keywords:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={100}
                  readOnly={use_case !== "Blog"}
                  placeholder="Enter any keywords here..."
                />
                <small className="block mb-2">Separate keywords with a comma</small>
              </div>
            )}

            {use_case === "Brand Name" && (
              <div id="">
                <label>
                  <strong>Initial name suggestions for the brand:</strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={100}
                  readOnly={use_case !== "Brand Name"}
                  placeholder="Example: ModaChic, StyleWave, LuxaVogue."
                />
                <br></br>
              </div>
            )}

            {use_case === "Business Ideas" && (
              <div>
                <label>
                  <strong>A concise description of the proposed business venture:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Business Ideas"}
                  placeholder="Example: A healthy restaurant with an organic menu..."
                />
                <small className="block mb-2">Max 200 words</small>
              </div>
            )}

            {use_case === "Cover Letter" && (
              <div>
                <label>
                  <strong>Information about your relevant work experience:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Cover Letter"}
                  placeholder="Example:  I have 5 years of experience in the marketing industry."
                />
                <small className="block mb-2">Max 200 words</small>
              </div>
            )}

            {use_case === "Write Email" && (
              <div>
                <label>
                  <strong> The content or message of the email to be sent:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Write Email"}
                  placeholder="Example: Dear John, I wanted to inform you about..."
                />
                <small className="block mb-2">Max 200 words</small>
              </div>
            )}

            {use_case === "Write Email Reply" && (
              <div>
                <label>
                  <strong> Your response or reply to the initial email:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Write Email Reply"}
                  placeholder="Example: Thank you for your interest in our product..."
                />
                <small className="block mb-2">Max 200 words</small>
              </div>
            )}

            {use_case === "Job Description" && (
              <div>
                <label>
                  <strong> The skills and qualifications required for the position:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Job Description"}
                  placeholder="Example: Qualifications experience in HTML, CSS, and JavaScript..."
                />
                <small className="block mb-2">Max 200 words</small>
              </div>
            )}

            {use_case === "Legal Agreement" && (
              <div>
                <label>
                  <strong> The length or duration of the lease: </strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Legal Agreement"}
                  placeholder="Example: The Lease Duration is 12 months"
                />
                <small className="block mb-2">Max 200 words</small>
              </div>
            )}

            {use_case === "Post and Caption Ideas" && (
              <div>
                <label>
                  <strong> Relevant hashtags to accompany your social media post: </strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Post and Caption Ideas"}
                  placeholder="Example: Hashtags #TravelLocal #WisataIndonesia"
                />
              </div>
            )}

            {use_case === "Product Description" && (
              <div>
                <label>
                  <strong> Unique features or advantages of the product: </strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Product Description"}
                  placeholder="Example: Product Benefits is High protein content, great taste, and easy to prepare."
                />
              </div>
            )}

            {use_case === "Proposal Later" && (
              <div>
                <label>
                  <strong> Specific details of the proposal, including background, plan, etc: </strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Proposal Later"}
                  placeholder="Example: We propose to conduct a comprehensive market research..."
                />
              </div>
            )}

            {use_case === "Review" && (
              <div>
                <label>
                  <strong> Advantages and disadvantages of the product or service: </strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Review"}
                  placeholder="Example: Have a Pros: Excellent camera quality and Cons: Short battery life..."
                />
              </div>
            )}

            {use_case === "Review Feedback" && (
              <div>
                <label>
                  <strong> Feedback Message about constructive feedback or suggestions: </strong>
                </label>
                <input
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Review Feedback"}
                  placeholder="Example: Feedback Message is The product needs improvement in terms of reliability..."
                />
              </div>
            )}

            {use_case === "Social Media advertisement" && (
              <div>
                <label>
                  <strong> The goal or purpose of your social media advertisement: </strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Social Media advertisement"}
                  placeholder="Example: Ad Objective is Promote our latest fashion collection..."
                />
              </div>
            )}

            {use_case === "Story Plot" && (
              <div>
                <label>
                  <strong> The primary challenge or conflict in your story.: </strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  maxLength={200}
                  readOnly={use_case !== "Story Plot"}
                  placeholder="Example: Main Conflict is Mission to save the kingdom from destruction..."
                />
                <small className="block mb-2">Max 200 words</small>
              </div>
            )}

            <button type="submit" className="btn" disabled={!topic.trim() || !keywords.trim}>
              Generate
            </button>

            <Link href="/post/dashboard" className="btn mt-3 bg-purple-500 hover:bg-indigo-500">
              {" "}
              Change Use Case
            </Link>
          </form>
        </div>
      )}
    </div>
  );
}

// Define the layout for the 'newPost' component
newPost.getLayout = function getLayout(page, pageProps) {
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
