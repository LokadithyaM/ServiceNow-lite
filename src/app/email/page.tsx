"use client";
import UserSelect from "@/components/dbsearch";
import React, { useEffect, useState } from "react";

interface Message {
    sender: string;
    receiver: string;
    message: string;
    timestamp: number;
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    messages: [];
}



export default function LandingPage() {
  const [users, setAllowedUsers] = useState<User[]>([]);
    const [profiles, setProfiles] = useState<(User & { id: number; showDetails: boolean;})[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<(User & { id: number }) | null>(null);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        assigned_to: "",
      });
    

      useEffect(() => {
        async function initializeProfiles() {
          try {
            // 1. Get session
            const sessionRes = await fetch("/api/session");
            if (!sessionRes.ok) throw new Error("Session fetch failed");
      
            const sessionData = await sessionRes.json();
            const currentUser = sessionData.email;
      
            // 2. Get allowed users
            const usersRes = await fetch("/api/allowedUsers");
            if (!usersRes.ok) throw new Error("Allowed users fetch failed");
      
            const { allowedUsers } = await usersRes.json();
            setAllowedUsers(allowedUsers);
      
            // 3. For each user, check chat
            const fetchedProfiles = [];
      
            for (const user of allowedUsers) {
              if (user.email === currentUser) continue;
              console.log(user.email+" "+currentUser);
      
              const res = await fetch("/api/checkchat", {
                method: "POST",
                body: JSON.stringify({ sender: currentUser, receiver: user.email }),
              });
      
              const data = await res.json();
              console.log(data);
      
              if (data.chat) {
                fetchedProfiles.push({
                  id: fetchedProfiles.length + 1,
                  _id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  role: user.role,
                  messages: data.chat.messages,
                  showDetails: false,
                });
              }
            }

            console.log(fetchedProfiles);
      
            setProfiles(fetchedProfiles);
          } catch (err) {
            console.error("Profile initialization failed:", err);
          }
        }
      
        initializeProfiles();
      }, []);
      

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
    
        const current = updatedUsers.find(
            (user) => `${user.firstName} ${user.lastName}` === formData.assigned_to
        );
    
        console.log("Selected User:", current);
        if (current) {
            console.log("Selected User:", current);
            setProfiles([
              ...profiles,
              {
                id: profiles.length + 1,
                _id: current._id,
                firstName: current.firstName,
                lastName: current.lastName,
                email: current.email,
                role: current.role,
                showDetails: false,
                messages: current.messages,
              },
            ]);
          } else {
            console.log("No matching user found for the name:", formData.assigned_to);
          }
    }
    

    return (
        <div className="min-h-screen w-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center gap-2 p-4">
          <div className="w-full h-full border-2 border-gray-700 flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg shadow-lg">
      
            {/* Main Content */}
            <div className="min-h-screen w-full border-2 border-gray-700 flex items-start gap-4 p-4 bg-gray-900 rounded-lg">
              
              {/* Left Container (Profiles) */}
              <div className="w-[600px] min-h-screen max-h-screen border-2 border-gray-700 flex flex-col items-center gap-3 overflow-auto rounded-lg shadow-lg bg-gray-800">
              <div className="w-full h-[200px] border-2 border-gray-700 flex flex-col gap-3 p-3 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-extrabold text-gray-600">Mindfull</h1>
            <div className="flex justify-between items-center gap-2">
                <UserSelect
                value={formData.assigned_to}
                onChange={(name) => setFormData((prev) => ({ ...prev, assigned_to: name }))}
                />
                <button onClick={handleAddProfile} className="w-[40px] h-[40px]">
                <img src="/contact.svg" alt="Add Contact" className="w-full h-full" />
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
              <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
                {selectedProfile ? (
                  <div className="w-full h-full bg-gray-900 border-2 border-gray-700 rounded-lg p-4 shadow-lg">
                    
                    {/* Profile Header */}
                    <div className="w-full border-b-2 border-gray-700 flex justify-between items-center pb-2">
                      <p className="text-lg font-semibold text-gray-300">
                        <strong>Name:</strong> {`${selectedProfile.firstName} ${selectedProfile.lastName}`}
                      </p>
                      <p className="text-lg font-semibold text-gray-300">
                        <strong>Email:</strong> {selectedProfile.email}
                      </p>
                    </div>
      
                    {/* Chat Component */}
                    <div className="w-full flex-1 border-2 border-gray-700 bg-gray-800 rounded-lg mt-4">
                      <Chat profile={selectedProfile} />
                    </div>
      
                  </div>
                ) : (
                  <p className="text-gray-400 text-lg text-center">Select a profile to view details.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
      
}


function Chat({ profile }: { profile: User | null }) {
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
      if (!profile?.email || !profile.messages) return;
  
      setMessages((prevMessages) => ({
          ...prevMessages,
          [profile.email!]: profile.messages,
      }));
  }, [profile]);
  
  
    useEffect(() => {
        async function fetchMessages() {
            try {
                const response = await fetch("/api/session");
                if (!response.ok) {
                    throw new Error("Session fetch failed");
                }
                const sessionData = await response.json();
                console.log("Session Data:", sessionData);
                setCurrentUserEmail(sessionData.email);
            } catch (error) {
                console.error("Error fetching session:", error);
                setCurrentUserEmail(null);
            }
        }

        fetchMessages();
    }, []);

    const handlePost = async () => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage) return;
    
      const newMessage: Message = {
        sender: currentUserEmail || "unknown",
        receiver: profile?.email || "",
        message: trimmedMessage,
        timestamp: Date.now(),
      };
    
      try {
        const res = await fetch("/api/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });
    
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Failed to send message:", errorData.error || res.statusText);
          return;
        }
    
        // Optimistically update local state
        setMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };
          const receiverEmail = profile?.email || "";
    
          if (!updatedMessages[receiverEmail]) {
            updatedMessages[receiverEmail] = [];
          }
    
          const existingMessages = updatedMessages[receiverEmail];
          const messageExists = existingMessages.some(
            (msg) =>
              msg.sender === newMessage.sender &&
              msg.message === newMessage.message &&
              msg.timestamp === newMessage.timestamp
          );
    
          if (!messageExists) {
            updatedMessages[receiverEmail].push(newMessage);
          }
    
          return updatedMessages;
        });
    
        setMessage("");
      } catch (error) {
        console.error("Error while sending message:", error);
      }
    };
    
      
    console.log(profile?.messages);
    return (
      <div className="p-4 border rounded-lg w-full h-full m-2 bg-gray-900">
        {/* Header */}
        <h2 className="pl-4 text-xl font-semibold mb-4 tracking-tight w-full flex items-center h-[50px] rounded-lg text-white bg-gray-800 border border-gray-700 shadow-md">
          Chat Messages
        </h2>
    
        {/* Messages Container (Scrollable) */}
        <div className="space-y-3 overflow-y-auto h-[500px] p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-inner">
          {messages[profile?.email||""]?.map((msg, index) => {
            const isSender = msg.sender === currentUserEmail;
            return (
              <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-lg max-w-[75%] shadow-md ${
                    isSender ? "bg-black text-white" : "bg-gray-700 text-gray-200"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {isSender ? "You" : msg.sender}
                  </p>
                  <p className="text-sm">{msg.message}</p>
                  <span className="text-xs text-gray-400 block text-right">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
  
        <div className="w-full mt-4 border-2 border-gray-700 bg-gray-800 rounded-lg flex items-center p-2">
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
            className="bg-transparent border-none outline-none text-lg flex-1 text-white placeholder-gray-400"
            placeholder="Type a message..."
            required
          />
          <button onClick={handlePost} className="w-[40px] h-[40px] rounded-full hover:scale-105 transition">
            <img src="/send.svg" alt="Send" className="w-full h-full" />
          </button>
        </div>
      </div>
    );
  }
  



/* ProfileCard Component */
function ProfileCard({ profile, toggleDetails, handleAddProfile, handleProfileClick }: { 
    profile: { id: number; showDetails: boolean; email: string; _id: string; firstName: string; lastName: string; role: string; messages:[];};
    toggleDetails: (id: number) => void;
    handleAddProfile: () => void;
    handleProfileClick: (profile: User & { id: number; showDetails: boolean }) => void;
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