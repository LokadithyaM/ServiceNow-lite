"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
     return (
        <div className="bg-black border-2 border-black h-[60px] flex w-full justify-between">
            <div className="flex">
                <div className="bg-black border-2 border-black h-[40px] w-[200px] m-2 rounded-lg relative overflow-hidden cursor-pointer" onClick={() => router.push("/")}>
                    <Image
                        className="dark:invert object-cover"
                        src="/logo.svg"
                        alt="Logo"
                        fill
                    />
                </div>

                <div className="flex bg-black  justify-center items-center border-2 border-black h-[40px] w-[100px] m-2 rounded-lg">
                    <h1 className="text-white">My Incidents</h1>
                </div>

                <div className="flex bg-black  justify-center items-center border-2 border-black h-[40px] w-[120px] m-2 rounded-lg">
                    <h1 className="text-white">Assigned to me</h1>
                </div>
            </div>
            <div className="flex">
                <div className="bg-black border-2 border-black h-[40px] w-[40px] m-2 rounded-full relative overflow-hidden cursor-pointer" onClick={() => router.push("/taskList")}>
                    <Image
                        className="dark:invert object-cover"
                        src="/globe.svg"
                        alt="Logo"
                        fill
                    />
                </div>
                <div className="relative">
                {/* Notification Icon */}
                    <div
                        className="bg-black border-2 border-black h-[40px] w-[40px] m-2 rounded-full relative overflow-hidden cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)} // Toggle visibility
                    >
                        <Image
                        className="dark:invert object-cover"
                        src="/notifcations.svg"
                        alt="Logo"
                        fill
                        />
                    </div>

                    {/* Floating Box (Appears below the icon) */}
                    {isOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white border border-black shadow-lg min-h-[200px] w-[300px] z-50 rounded-md p-2">
                        <p className="text-black text-sm">Notifications</p>
                        {/* Add more content inside if needed */}
                        </div>
                    )}
                </div>
                <div
                    className="bg-black border-2 p-2 border-black h-[40px] w-[40px] m-2 rounded-full relative overflow-hidden cursor-pointer"
                    onClick={() => router.push("/forms")}
                >
                    <Image
                        className="dark:invert object-contain"
                        src="/add.svg"
                        alt="Logo"
                        fill
                    />
                </div>

                <div className="bg-black border-2 border-black h-[40px] w-[40px] m-2 rounded-full relative overflow-hidden cursor-pointer" onClick={() => router.push("/team")} >
                    <Image
                        className="dark:invert object-cover"
                        src="/teams.svg"
                        alt="Logo"
                        fill
                    />
                </div>
            </div>
        </div>
     );
  }
  