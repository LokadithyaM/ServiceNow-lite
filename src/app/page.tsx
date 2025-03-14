"use client";
import {useSession} from "@/hooks/useSession"

export default function Home() {
  const session = useSession(); // Auto-check session

  if (!session) {
    return <p>Loading...</p>; // Show a loading state until session is checked
  }

  return (
    <div className="border-2 border-white bg-[#1B1B1B] bg-white grid items-center justify-items-center min-h-screen sm:font-[family-name:var(--font-geist-sans)]">
      <div
        className="relative border-2 border-black w-full min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/gg.jpg')" }}
      >
        {/* SVG Image - Positioned Responsively */}
        <img
          src="/arrow1.svg"
          alt="SVG Graphic"
          className="absolute top-[5%] right-[10%] w-[40vw] max-w-[250px] h-auto object-contain"
        />

        {/* Headings - Responsively Positioned & Sized */}
        <h1 className="absolute top-[2%] left-[5%] text-[10vw] max-text-[200px] text-black">
          Think... Build,
        </h1>
        <h1 className="absolute top-[35%] left-[60%] text-[5vw] max-text-[100px] text-black">
          Stuck? Just ask
        </h1>
      </div>
    </div>
  );
}
