"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface Company {
  name: string;
  adminId: string;
}


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const router = useRouter();
  const isFormValid = email.trim() !== "" && password.trim() !== "" && selectedCompany !== "";


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        if (!res.ok) throw new Error("Failed to fetch companies");

        const data: Company[] = await res.json();
        // console.error(res);
        setCompanies(data);
      } catch (error) {
        setMessage("Failed to load companies");
      }
    };

    fetchCompanies();
  }, []);

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email,companyId: selectedCompany, password : password, action: "login" }),
    });

    const data = await res.json();
    
    if (res.ok) {
      router.push("/");
    } else {
      setMessage(data.message || data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Login</h2>
      <select
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
        className="border p-2 m-2"
      >
        <option value="">Select Company</option>
        {companies.map((company) => (
          <option key={company.adminId} value={company.adminId}>
            {company.name}
          </option>
        ))}
      </select>

      <input
        type="email"
        placeholder="Email"
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
      <button
        onClick={handleLogin}
        className={`px-4 py-2 text-white ${isFormValid ? "bg-green-500" : "bg-gray-400 cursor-not-allowed"}`}
        disabled={!isFormValid}
      >
        Login
      </button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
}
