"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, action: "signup_user" }),
    });

    const data = await res.json();
    
    if (res.ok) {
      router.push("/signin");
    } else {
      setMessage(data.message || data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800">User Sign Up</h2>
        <p className="text-gray-500 text-center mb-6">Create an account to get started</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
          />
        </div>

        <button
          onClick={handleLogin}
          className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
            isFormValid ? "bg-green-600 hover:bg-green-700 shadow-md" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          Sign Up
        </button>

        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/signin" className="text-green-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
