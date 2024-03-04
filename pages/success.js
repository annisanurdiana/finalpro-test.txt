// RUN: npm run dev
// url: http://localhost:3000
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";
import Link from "next/link";
import Image from "next/image";
import imageTest from "../public/love.gif";

export default function Success() {
  const handleClick = async () => {
    await fetch("/api/addTokens", {
      method: "POST",
    });
  };

  //console.log("Test:", props);

  return (
    <div className="container mx-auto flex px-5 py-18 items-center justify-center flex-col">
      <Image src={imageTest} alt="thanks gif" className="h-50 lg:w-2/6 md:w-3/5 w-5/6 rounded-l" />
      <div className="text-center lg:w-2/3 w-full">
        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Thank You for Your Purchase!</h1>
        <p className="mb-8 leading-relaxed">......................................</p>
        <div className="flex justify-center">
          <Link href="/post/dashboard" className="inline-flex text-white bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg">
            {" "}
            GO TO DASHBOARD
          </Link>{" "}
          <Link href="/token-topup" className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
            {" "}
            TOP-UP ANYMORE
          </Link>
        </div>
      </div>
      {/*  */}
      <div>
        {" "}
        {/* <button className="btn" onClick={handleClick}>
        Add Tokens
      </button> */}
        <br></br>
      </div>
    </div>
  );
}

Success.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
