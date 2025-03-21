"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CompanySelect from "@/components/company";

interface Company {
  name: string;
  adminId: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company>({
    name: "",
    adminId: "",
  }); 
  const router = useRouter();
  const isFormValid = email.trim() !== "" && password.trim() !== "" && selectedCompany.adminId !== "";

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, companyId: selectedCompany.adminId, password, action: "login" }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/");
    } else {
      setMessage(data.message || data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

        <p className="text-gray-500 text-center mb-6">Sign in to continue</p>

        <div className="space-y-4">
          <CompanySelect
            value={selectedCompany.adminId}
            onChange={(adminId) => setSelectedCompany((prev) => ({ ...prev, adminId }))}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>

        <button
          onClick={handleLogin}
          className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
            isFormValid ? "bg-blue-600 hover:bg-blue-700 shadow-md" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          Login
        </button>

        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
