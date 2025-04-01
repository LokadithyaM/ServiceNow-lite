"use client";
import {useSession} from "@/hooks/useSession"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AI from "@/ai/page"


export default function Home() {
  const session = useSession(); // Auto-check session
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClick = () => {
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

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

        {/* <div className="relative"> */}
          <div
            className="bg-black border-2 p-2 border-black h-[90px] w-[90px] m-2 rounded-full absolute bottom-30 right-10 cursor-pointer"
            onClick={handleClick}
          >
            <Image
              className="dark:invert object-contain"
              src="/brain.svg"
              alt="Logo"
              fill
            />
          </div>

          {/* Overlay */}
          {showOverlay && (
            <div className="fixed bottom-30 right-10 w-[600px] h-[200px] flex items-center justify-center">
              <div className="bg-white p-4 w-full rounded-lg relative">
                <button
                  onClick={closeOverlay}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Close
                </button>
                {/* Your component/content here */}
                <h1>Feeling Lazy?</h1>
                <p>Type up in short regarding the email or ticket <br/> ai will handle it.</p>
                <AI/>
              </div>
            </div>
          )}
        </div>

      {/* </div> */}
    </div>
  );
}
