"use client";
import UserSelect from "@/components/dbsearch";
import { NextResponse } from "next/server";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", { path: "/api/socket" });

interface Message {
    sender: string;
    receiver: string;
    message: string;
    timestamp: string;
}

export default function LandingPage() {
    interface User {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      }

      const [profiles, setProfiles] = useState<(User & { id: number; showDetails: boolean })[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<(User & { id: number }) | null>(null);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        assigned_to: "",
      });
    

    useEffect(() =>{
        async function fetchKnown(){
            console.log("just passing time here");
        }

        fetchKnown();
    },[]);

    const handlePost = async () => {
        const trimmedMessage = message.trim();
        console.log("hello!@handlePost");
    };

    function toggleDetails(id: number) {
        setProfiles((prevProfiles) =>
            prevProfiles.map((profile) =>
                profile.id === id ? { ...profile, showDetails: !profile.showDetails } : profile
            )
        );
    }

    function handleProfileClick(user: User & { id: number }) {
        setSelectedProfile(user);
    }
    

    const [users, setAllowedUsers] = useState<User[]>([]);

    async function handleAddProfile() {
        if (formData.assigned_to === "") {
            console.error("Bruv, select someone!");
            return;
        }
    
        let updatedUsers = users;
    
        if (users.length === 0) {
            try {
                const res = await fetch("/api/allowedUsers");
                if (!res.ok) {
                    throw new Error("Failed to fetch allowed users");
                }
                const data = await res.json();
                setAllowedUsers(data.allowedUsers);
                updatedUsers = data.allowedUsers; // Use the fetched users
            } catch (err: any) {
                console.error(err.message);
                return;
            }
        }
    
        // Find user after ensuring data is available
        const current = updatedUsers.find(
            (user) => `${user.firstName} ${user.lastName}` === formData.assigned_to
        );
    
        console.log("Selected User:", current);
        if (current) {
            console.log("Selected User:", current);
            setProfiles([
              ...profiles,
              {
                id: profiles.length + 1, // Unique ID for the profile
                _id: current._id, // User _id
                firstName: current.firstName,
                lastName: current.lastName,
                email: current.email,
                role: current.role,
                showDetails: false, // New property for toggling details
              },
            ]);
          } else {
            console.log("No matching user found for the name:", formData.assigned_to);
          }
    }
    

    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
        <div className="w-full h-full flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-lg">
          
          {/* Main Content */}
          <div className="w-full flex flex-col items-start gap-4 p-4">
            
            {/* Right Container (Displays Clicked Profile's Details) */}
            <div className="w-full bg-white text-gray-900 flex flex-col">
              
                  {/* Chat Component */}
                  <div className="w-full flex mt-4">
                    <Chat email={"dummy"} />
                  </div>
              
            </div>
    
            <div className="w-full max-h-screen overflow-auto flex flex-col gap-4">
              <div className="w-full h-[200px] flex flex-col gap-5 p-4 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-extrabold text-gray-700">Tagged Users</h1>
                <div className="flex justify-end gap-2 items-center">
                  <UserSelect
                    value={formData.assigned_to}
                    onChange={(name) => setFormData((prev) => ({ ...prev, assigned_to: name }))}
                  />
                  <button onClick={handleAddProfile} className="w-[50px] h-[50px]">
                    <img src="/contact.svg" alt="SVG Icon" className="w-full h-full" />
                  </button>
                </div>
              </div>
    
              {/* Render Profile Cards */}
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  toggleDetails={toggleDetails}
                  handleAddProfile={handleAddProfile}
                  handleProfileClick={handleProfileClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
    
      
}

function Chat({ email }: { email: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchMessages() {
        console.log("random niga");
    }

    fetchMessages();
  }, [email]);

  const handlePost = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const newMessage: Message = {
        sender: currentUserEmail || "unknown", // Use currentUserEmail as sender
        message: trimmedMessage,
        timestamp: new Date().toISOString(),
        receiver: ""
    };

    // Add the new message to the messages state
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Clear the input field after posting
    setMessage("");
  };

  return (
    <div className="rounded-lg w-full h-full m-4 bg-white">
      {/* Header */}
      <h2 className="pl-4 text-xl font-semibold mb-6 tracking-tight w-full flex items-center h-[50px] rounded-lg text-gray-900 bg-white border border-gray-300">
        Follow up corner
      </h2>
  
      {/* Messages Container (Scrollable) */}
      <div className="space-y-4 overflow-y-auto h-[500px] p-4 bg-white rounded-lg border border-gray-300">
        {messages.map((msg, index) => {
          const isSender = msg.sender === currentUserEmail;
          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-4 rounded-lg max-w-[80%] shadow-lg ${
                  isSender
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm font-semibold">
                  {isSender ? "You" : msg.sender}
                </p>
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs text-gray-500 block text-right">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
  
      {/* Input Section */}
      <div className="w-full mt-6 border-2 border-gray-200 bg-white rounded-lg flex items-center p-3">
        <input
          type="text"
          value={message ?? ""}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && message.trim() !== "") {
              e.preventDefault();
              handlePost();
            }
          }}
          className="bg-transparent border-none outline-none text-lg flex-1 text-black placeholder-gray-400"
          placeholder="Type a message..."
          required
        />
        <button
          onClick={handlePost}
          className="w-[45px] h-[45px] rounded-full hover:scale-105 transition"
        >
          <img src="/send.svg" alt="Send" className="w-full h-full" />
        </button>
      </div>
    </div>
  );
}  



/* ProfileCard Component */
function ProfileCard({ profile, toggleDetails, handleAddProfile, handleProfileClick }: { 
    profile: { id: number; showDetails: boolean; email: string; _id: string; firstName: string; lastName: string; role: string };
    toggleDetails: (id: number) => void;
    handleAddProfile: () => void;
    handleProfileClick: (profile: { id: number; _id: string; firstName: string; lastName: string; email: string; role: string }) => void;
  }) {
    const [email, setEmail] = useState(profile.email);
    const [name, setName] = useState(`${profile.firstName} ${profile.lastName}`);

    async function handleRemoveProfile(email: string): Promise<void> {
        console.log("baka");
    }
    

    return (
        <div className="group w-full text-black bg-white h-auto border-2 border-gray-800 flex flex-col items-center p-2 cursor-pointer shadow-white shadow-lg rounded-xl">
            {!profile.showDetails ? (
                <div onClick={() => handleProfileClick(profile)} className="w-full h-[90px] border-2 border-black flex items-center p-2 justify-between">
                    <div className="w-[280px] h-[60px] text-gray-300 border-2 border-black rounded-xl m-2 flex items-center justify-center text-xl font-bold">
                        {name}
                    </div>
                    <button onClick={() => toggleDetails(profile.id)} className="w-[40px] h-[40px] border-2 border-black rounded-xl flex items-center justify-center">
                        <img src="/user.svg" alt="SVG Icon" className="w-8 h-8 text-green-500" />
                    </button>
                </div>
            ) : (
                <div className="w-full h-full text-black border-2 border-black flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-green-500 mb-4">Update Contact</h1>
                        <button onClick={() => handleRemoveProfile(email)} className="w-[150px] h-10 bg-red-700 text-white font-bold rounded-full hover:bg-gray-300 transition duration-200">
                            remove
                        </button>
                    </div>
            )}
        </div>
    );
}