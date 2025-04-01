"use client";
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
    const [profiles, setProfiles] = useState<{ id: number; name: string; email: string; showDetails: boolean }[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<{ id: number; name: string; email: string } | null>(null);
    const [message, setMessage] = useState("");
    const [postedMessage, setPostedMessage] = useState("");
    const [currentUserEmail,setCurrentUserMail] = useState("");

    useEffect(() =>{
        async function fetchKnown(){
            try{
                const userResponse = await fetch("/api/getCurrentUser");
                const userData = await userResponse.json();
                const currentEmail = userData.user?.email;
    
                if (!currentEmail) {
                    console.error("User not logged in!");
                    return;
                }

                setCurrentUserMail(currentEmail);

                const response = await fetch("/api/fetchKnown", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ currentEmail }),
                });

                if (!response.ok) {
                    console.error("Failed to fetch known users");
                    return;
                }

                const data = await response.json();
                const knownUsers = data.users || [];

                setProfiles(
                    knownUsers.map((user: { name: string; email: string }, index: number) => ({
                        id: index + 1,
                        name: user.name,
                        email: user.email,
                    }))
                );
            }catch{
                console.log("Error fetching known users:");
            }
        }

        fetchKnown();
    },[]);

    const handlePost = async () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return; // Prevent empty messages
    
        setPostedMessage(trimmedMessage);
        setMessage("");
    
        try {
            const userResponse = await fetch("/api/getCurrentUser");
            const userData = await userResponse.json();
            const currentEmail = userData.user?.email;
    
            if (!currentEmail) {
                console.error("User not logged in!");
                return;
            }

    
            // Identify recipient from the UI or context
            const recipientEmail = selectedProfile?.email; // Ensure you have selectedUser context

            // console.error("",currentEmail);
            // console.error("",recipientEmail);

            const timestamp = new Date().toISOString();

            const payload = {
                sender: currentEmail,
                recipient: recipientEmail,
                message: trimmedMessage,
                timestamp: timestamp
            };
    
            // Send the message to /api/transfers
            const response = await fetch("/api/transfers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("Server response:", data);
            
            if (selectedProfile) {
                setSelectedProfile(null);  // Reset selection momentarily
                setTimeout(() => {
                    setSelectedProfile(selectedProfile); // Re-select profile to trigger re-render
                }, 100); // Small delay to ensure UI updates
            }

            // if (!response.ok) {
            //     const error = await response.json();
            //     console.error("Failed to send message:", error.message);
            // }
        } catch (error) {
            console.error("Error during message post:", error);
        }
    };

    function handleClick() {
        setProfiles([...profiles, { id: profiles.length + 1, name: `User ${profiles.length + 1}`, email: `test@gmail.com`, showDetails: false }]);
    }

    function toggleDetails(id: number) {
        setProfiles((prevProfiles) =>
            prevProfiles.map((profile) =>
                profile.id === id ? { ...profile, showDetails: !profile.showDetails } : profile
            )
        );
    }

    function handleProfileClick(profile: { id: number; name: string; email: string }) {
        setSelectedProfile(profile);
    }

    async function handleAddProfile(id: number, email: string, name: string) {
        try{
            setProfiles((prevProfiles) =>
                prevProfiles.map((profile) =>
                    profile.id === id ? { ...profile, email, name, showDetails: false } : profile
                )
            );

            const userResponse = await fetch("/api/getCurrentUser");
            const userData = await userResponse.json();
            const currentEmail = userData.user?.email;

            if (!currentEmail) {
                console.error("what the heellll!");
                return;
            }


            // Make the API call to update known users
            const response = await fetch("/api/addKnown", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentEmail, newUserEmail: email, name }),
            });

            const data = await response.json();

            if (!response.ok) {
                return NextResponse.json({ message: "Damn i would have to send a personal mail now!" }, { status: 404 });
            }
            
            return NextResponse.json({ message: "User added!" }, { status: 200 });
        }catch{
            console.log("bruv come on!");
        }
    }

    return (
        <div className="h-auto w-full bg-white border-2 border-black flex items-center justify-center gap-2">
            <div className="w-full h-full border-2 border-black flex flex-col items-center gap-2 p-2">

                {/* Main Content */}
                <div className="min-h-screen w-full border-2 bg-transparent border-black flex items-start gap-2 p-2">
                    {/* Left Container (Profiles) */}
                    <div className="w-[800px] min-h-screen max-h-screen border-2 border-black flex flex-col items-center gap-1 overflow-auto shadow-white shadow-xl">
                        <div className="w-full h-[200px] border-2 border-black shadow-white shadow-xl flex flex-col gap-5 p-2">
                            <h1 className="text-5xl font-extrabold tracking-tight text-gray-500">Mindfull</h1>
                            <div className="flex justify-end">
                                <button onClick={handleClick} className="w-[50px] h-[50px] mt-[60px]">
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

                    {/* Right Container (Displays Clicked Profile's Details) */}
                    <div className="w-full h-[940px] flex flex-col bg-transparent text-white">
                        {selectedProfile ? (
                            <div className="w-full h-full bg-transparent text-whiteborder-2 border-black">
                                <div className="w-full border-2 border-black bg-transparent flex text-1xl justify-between font-extrabold tracking-tight text-gray-500 items-center">
                                    <div>
                                        <p className="mr-[50px] text-1xl font-bold pr-[400px]"><strong>Name:</strong> {selectedProfile.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-1xl font-bold"><strong>Email:</strong> {selectedProfile.email}</p>
                                    </div>
                                    
                                </div>

                                <div className="w-full h-9/10 border-2 border-black text-black mb-2">
                                    <Chat 
                                        email={selectedProfile.email}
                                    />
                                </div>


                                <div className="w-full min-h-[60px] mt-4 border-2 border-black flex flex-col items-center justify-center">
                                <div className="w-full h-[60px] rounded-xl flex items-center px-4">
                                    <input
                                        type="text"
                                        value={message ?? ""}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey && message.trim() !== "") {
                                                e.preventDefault(); // Prevents new line (useful for textareas)
                                                handlePost();
                                            }
                                        }}
                                        className="border-none outline-none text-lg flex-1 font-black"
                                        placeholder="Type a message..."
                                        required
                                    />

                                    <button onClick={handlePost} className="w-[50] h-[50] rounded-full">
                                        <img src="/send.svg" alt="SVG Icon" className="w-full h-full" />
                                    </button>
                                </div>
                                </div>
                            </div>
                        ) : (
                            <p>Select a profile to view details.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Chat({ email }: { email: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      if (!email) return;

      try {
        // Fetch current user
        const userResponse = await fetch("/api/getCurrentUser");
        const userData = await userResponse.json();
        const currentUser = userData.user?.email;

        if (!currentUser) return;
        setCurrentUserEmail(currentUser);

        const selectedUserEmail = email;

        // Create hash keys for both possible conversations
        const hashKey1 = `${currentUser.replace(/[@.]/g, "_")}#${selectedUserEmail.replace(/[@.]/g, "_")}`;
        const hashKey2 = `${selectedUserEmail.replace(/[@.]/g, "_")}#${currentUser.replace(/[@.]/g, "_")}`;

        console.log("Fetching messages with keys:", hashKey1, "or", hashKey2);

        // Fetch messages
        const res = await fetch(`/api/fetchMessages?email=${currentUser}`);
        const data = await res.json();

        // Normalize messages (ensure sender and recipient exist)
        const normalizeMessage = (msg: any, defaultSender: string, defaultRecipient: string) => ({
          sender: msg.sender || defaultSender, // If missing sender, assume it's from the other user
          recipient: msg.recipient || defaultRecipient,
          message: msg.message,
          timestamp: msg.timestamp,
        });

        const sentMessages = (data[hashKey1] || []).map((msg: any) =>
          normalizeMessage(msg, currentUser, selectedUserEmail)
        );

        const receivedMessages = (data[hashKey2] || []).map((msg: any) =>
          normalizeMessage(msg, selectedUserEmail, currentUser)
        );

        const allMessages = [...sentMessages, ...receivedMessages].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        setMessages(allMessages);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    }

    fetchMessages();
  }, [email]);

  return (
    <div className="p-4 border rounded-lg w-full h-full m-2">
  <h2 className="pl-2 text-xl font-bold mb-4 tracking-tight w-full flex items-center h-[50px] rounded-lg text-white border-2 border-white">
    Chat Messages
  </h2>

  {/* Ensure the scrollable area has a fixed height and proper overflow settings */}
    <div className="space-y-3 overflow-y-auto h-[600px] p-4">
        {messages.map((msg, index) => {
        const isSender = msg.sender === currentUserEmail;
        return (
            <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
            <div
                className={`p-2 border rounded-lg max-w-[75%] text-gray-200 ${isSender ? " bg-white" : "text-black bg-[#262626]"}`}
            >
                <p className="text-sm font-semibold">{isSender ? "You" : msg.sender}</p>
                <p>{msg.message}</p>
                <span className="text-xs text-gray-500 block text-right">
                {new Date(msg.timestamp).toLocaleString()}
                </span>
            </div>
            </div>
        );
        })}
    </div>
    </div>

  );
}



/* ProfileCard Component */
function ProfileCard({ profile, toggleDetails, handleAddProfile, handleProfileClick }: { 
    profile: { id: number; showDetails: boolean; email: string; name: string };
    toggleDetails: (id: number) => void;
    handleAddProfile: (id: number, email: string, name: string) => void;
    handleProfileClick: (profile: { id: number; name: string; email: string }) => void;
}) {
    const [email, setEmail] = useState(profile.email);
    const [name, setName] = useState(profile.name);

    async function handleRemoveProfile(email: string): Promise<void> {
        try {
            const userResponse = await fetch("/api/getCurrentUser");
            const userData = await userResponse.json();
            const currentEmail = userData.user?.email;
    
            if (!currentEmail) {
                console.error("Error: Current user email not found");
                return;
            }
    
            const res = await fetch("/api/removeUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentEmail, removeUser: email })
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                console.error("Failed to remove contact:", data.message);
            } else {
                console.log("Contact removed successfully:", data.message);
            }

            window.location.reload();
        } catch (error) {
            console.error("Error in handleRemoveProfile:", error);
        }
    }
    

    return (
        <div className="group w-full text-black bg-white h-auto border-2 border-gray-800 flex flex-col items-center p-2 cursor-pointer shadow-white shadow-lg rounded-xl">
            {!profile.showDetails ? (
                <div onClick={() => handleProfileClick(profile)} className="w-full h-[90px] border-2 border-black flex items-center p-2 justify-between">
                    <div className="w-[280px] h-[60px] text-gray-300 border-2 border-black rounded-xl m-2 flex items-center justify-center text-xl font-bold">
                        {profile.name}
                    </div>
                    <button onClick={() => toggleDetails(profile.id)} className="w-[40px] h-[40px] border-2 border-black rounded-xl flex items-center justify-center">
                        <img src="/user.svg" alt="SVG Icon" className="w-8 h-8 text-green-500" />
                    </button>
                </div>
            ) : (
                <div className="w-full h-full text-black border-2 border-black flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-green-500 mb-4">Update Contact</h1>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded text-lg w-full mb-4" required />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded text-lg w-full mb-4" required />
                    <div className="flexs justify-between">
                        <button onClick={() => handleAddProfile(profile.id, email, name)} className="w-[150px] h-10 bg-green-700 text-white font-bold rounded-full hover:bg-green-800 transition duration-200 mr-2">
                            conform
                        </button>
                        <button onClick={() => handleRemoveProfile(email)} className="w-[150px] h-10 bg-red-700 text-white font-bold rounded-full hover:bg-gray-300 transition duration-200">
                            remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}