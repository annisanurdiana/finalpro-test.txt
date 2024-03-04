// RUN: npm run dev
// url: http://localhost:3000

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

// export default function tokenTopup(props) {
//   const handleClick = async () => {
//     await fetch("/api/addTokens", {
//       method: "POST",
//     });
//     location.reload(); // refresh halaman
//   };

export default function tokenTopup(props) {
  const handleClick_paid = async () => {
    const result = await fetch("/api/addTokens_paid", {
      method: "POST",
    });
    const json = await result.json();
    console.log("Result:", json);
    window.location.href = json.session.url;
  };
  // Dummy Card Info input: 4242 4242 4242 4242

  // const handleClick = async () => {
  //   await fetch("/api/addTokens", {
  //     method: "POST",
  //   });
  //   location.reload(); // refresh halaman
  // };

  // TOP-UP FUNCTION
  const handleClick = async () => {
    const lastTopUpTime = localStorage.getItem("lastTopUpTime");
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - (lastTopUpTime || 0);

    // Jika selisih waktu kurang dari 12 jam (dalam milidetik)
    if (timeDifference < 5 * 60 * 60 * 1000) {
      alert("Sorry, you can only top-up once every 5 hours.");
    } else {
      // Lakukan top-up
      await fetch("/api/addTokens", {
        method: "POST",
      });

      // Save top-up last time in local storage
      localStorage.setItem("lastTopUpTime", currentTime.toString());
      alert("Top-up successful! 10 tokens have been added.");

      location.reload();
    }
  };

  return (
    <div>
      <div className="container px-5 py-5 mx-auto">
        <div className="flex flex-col text-center w-full mb-4">
          <br></br>
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">TOP-UP TOKEN</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">
            Elevate your experience and unlock endless possibilities. Choose your path now! <br></br>
          </p>
          {/* <div className="flex mx-auto border-2 border-purple-500 rounded overflow-hidden mt-6">
            <button className="py-1 px-4 bg-purple-500 text-white focus:outline-none">Tokens</button>
            <button className="py-1 px-4 focus:outline-none">Topup</button>
          </div> */}
        </div>
        <div className="flex flex-wrap -m-4 justify-center">
          <div className="p-4 xl:w-1/3 md:w-1/2 w-full">
            <div className="h-full p-6 rounded-lg border-2 border-indigo-300 flex flex-col relative overflow-hidden">
              <h2 className="text-sm tracking-widest title-font mb-1 font-medium">START</h2>
              <h1 className="text-5xl text-gray-900 pb-4 mb-4 border-b border-indigo-200 leading-none">Free</h1>

              {/* <div>
                <img className="w-100 h-20 mb-4 object-cover" src="../components/coins.png" alt="Image description" />
              </div> */}
              <p className="flex items-center text-gray-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-indigo-400 text-white rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>
                Receive a generous token boost to enhance your journey.
              </p>

              <p className="flex items-center text-gray-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-indigo-400 text-white rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>
                Top-up only every 5 hours
              </p>

              <p className="flex items-center text-indigo-600 mb-4"></p>

              {/* <button className="flex items-center mt-auto text-white bg-indigo-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-500 rounded"> */}
              <button className="flex items-center mt-auto text-white bg-indigo-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-600 rounded" onClick={handleClick}>
                Add +10 tokens
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
              <p className="text-xs text-gray-500 mt-3">Power up your token balance today and embark on an extraordinary adventure like never before!</p>
            </div>
          </div>
          {/* TOP UP PAYMENT PAID */}
          <div className="p-4 xl:w-1/3 md:w-1/2 w-full">
            <div className="h-full p-6 rounded-lg border-2 border-purple-500 flex flex-col relative overflow-hidden">
              <span className="bg-purple-500 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>
              <h2 className="text-sm tracking-widest title-font mb-1 font-medium">PRO</h2>
              <h1 className="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
                <span>$10</span>
                <span className="text-lg ml-1 font-normal text-gray-500">/anytime</span>
              </h1>
              <p className="flex items-center text-gray-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>
                Rewards you with an abundant token windfall
              </p>
              <p className="flex items-center text-gray-600 mb-4">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>
                Top-ups any time!
              </p>
              <button className="flex items-center mt-auto text-white bg-purple-500 border-0 py-2 px-4 w-full focus:outline-none hover:bg-purple-700 rounded" onClick={handleClick_paid}>
                Add +100 Tokens
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
              <p className="text-xs text-gray-500 mt-3">Power up your token balance today and embark on an extraordinary adventure like never before!</p>
            </div>
          </div>
        </div>
      </div>
      {/* <h1>This is token top up page</h1>
      <button className="btn" onClick={handleClick}>
        Add +20 Tokens
      </button> */}
    </div>
  );
}

tokenTopup.getLayout = function getLayout(page, pageProps) {
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
