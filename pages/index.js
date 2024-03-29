// RUN: npm run dev
// url: http://localhost:3000

// Import necessary dependencies
import Image from "next/image";
import HeroImage from "../public/wal.jpg";
import { Logo } from "../components/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Image src={HeroImage} alt="Hero" fill className="absolute" />
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-500/30 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          Discover the unrivaled power of our advanced, AI-enabled SAAS solution, designed to easily produce posts optimized according to use case content. Improve the quality of your content without
          sacrificing time.
        </p>
        <br></br>
        <Link href="/post/dashboard" className="btn">
          Start Now
        </Link>
      </div>
    </div>
  );
}
