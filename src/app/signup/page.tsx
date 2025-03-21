"use client";

import { useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";


export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [allowedUsers, setAllowedUsers] = useState<
    { firstName: string; lastName: string; email: string; role: string }[]
  >([]);
  const router = useRouter();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    // ✅ Check file type
    if (file.type !== "text/csv") {
      console.error("Invalid file type. Please upload a CSV file.");
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = (e) => {
      if (!e.target?.result) {
        console.error("Error reading file");
        return;
      }
  
      const csvText = e.target.result as string;
  
      // ✅ Parse CSV
      Papa.parse(csvText, {
        header: true, // Assumes first row is the header
        skipEmptyLines: true,
        complete: (result: { data: String[]; }) => {
          const jsonData = result.data.map((row: any) => ({
            firstName: row["First Name"] || "",
            lastName: row["Last Name"] || "",
            email: row["Email"] || "",
            role: row["Role"] || "user",
          }));
  
          setAllowedUsers(jsonData);
        },
        error: (error: any) => console.error("Error parsing CSV:", error),
      });
    };
  
    reader.readAsText(file);
  };
  

  const handleSignup = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, company, allowedUsers, action: "registerAdmin" }),
      });

      if (!res.ok) throw new Error("Failed to connect to server");

      const data = await res.json();
      alert(data.message || data.error);
      router.push("/UserSignup");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error registering admin. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-4">Admin Sign Up</h2>
  
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:ring focus:border-blue-500"
        />
  
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:ring focus:border-blue-500"
        />
  
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:ring focus:border-blue-500"
        />
  
        <h3 className="text-lg font-semibold mt-4 text-center">Upload Allowed Users (CSV/Excel)</h3>
        <input
          type="file"
          accept=".csv, .xlsx"
          onChange={handleFileUpload}
          className="w-full border border-gray-300 rounded-lg p-2 mt-2"
        />
  
        {/* Uploaded Users List */}
        {allowedUsers.length > 0 && (
          <ul className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3 w-full max-h-40 overflow-y-auto">
            {allowedUsers.map((user, index) => (
              <li
                key={index}
                className="border-b last:border-none p-2 text-gray-700 text-sm"
              >
                {user.firstName} {user.lastName} - {user.email} ({user.role})
              </li>
            ))}
          </ul>
        )}
  
        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 text-white rounded-lg px-4 py-3 mt-4 hover:bg-blue-600 transition-all"
        >
          Register
        </button>
      </div>
    </div>
  );
}  