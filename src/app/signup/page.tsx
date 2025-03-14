"use client";

import { useState } from "react";
import Papa from "papaparse";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [allowedUsers, setAllowedUsers] = useState<
    { firstName: string; lastName: string; email: string; role: string }[]
  >([]);

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
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error registering admin. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Admin Sign Up</h2>

      <input
        type="text"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border p-2 m-2"
      />

      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 m-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 m-2"
      />

      <h3 className="text-lg font-semibold mt-4">Upload Allowed Users (CSV/Excel)</h3>
      <input
        type="file"
        accept=".csv, .xlsx"
        onChange={handleFileUpload}
        className="border p-2 m-2"
      />

      <ul className="mt-3">
        {allowedUsers.map((user, index) => (
          <li key={index} className="border p-2 mt-1">
            {user.firstName} {user.lastName} - {user.email} ({user.role})
          </li>
        ))}
      </ul>

      <button onClick={handleSignup} className="bg-blue-500 text-white px-4 py-2 mt-4">
        Register
      </button>
    </div>
  );
}
