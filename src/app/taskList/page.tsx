"use client";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
const router = useRouter();

interface Incident {
    id: string;
    opened: string;
    Short_description: string;
    caller: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    state: "New" | "In Progress" | "Resolved" | "On Hold";
    category: string;
    assigned_to: string;
    updated: string;
    updated_by: string;
}
  
const [incidents, setIncidents] = useState<Record<string, Incident>>({});
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
    const fetchIncidents = async () => {
        try {
            const res = await fetch("/api/incidnets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "fetch_Incident_Id" }),
                credentials: "include", // Ensures cookies (session_token) are sent
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status} ${await res.text()}`);
            }

            const data = await res.json();
            if (typeof data.incidents !== "object" || data.incidents === null) {
                throw new Error("Invalid response format: Expected an object (map)");
            }

            setIncidents(data.incidents);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchIncidents();
}, []);



const handleClick = (id: string) => {
    console.log("Clicked ID:", id);
};




  return (
    <div className="border-2 border-white bg-[#1B1B1B] bg-white flex flex-col items-center justify-items-center min-h-screen sm:font-[family-name:var(--font-geist-sans)]">
        <div className="border-2 border-black w-full min-h-[750px]">
            <div
                className="bg-gray-200 border-2 p-4 aspect-square w-[8vw] max-w-[70px] min-w-[50px] rounded-full 
                overflow-hidden cursor-pointer fixed bottom-[8vh] right-[5vw] shadow-black shadow-xl"
                onClick={() => router.push("/forms")}
            >
                <Image
                    className="dark:invert object-contain"
                    src="/add.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                />
            </div>


            <TableContainer component={Paper} className="mt-4">
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>opened</TableCell>
                            <TableCell>Short Description</TableCell>
                            <TableCell>Caller</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Assigned to</TableCell>
                            <TableCell>Updated</TableCell>
                            <TableCell>Updated By</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(incidents).map(([key, incident]) => (
                                <TableRow key={key}>
                                    <TableCell 
                                        className="!text-blue-900 cursor-pointer hover:underline" 
                                        onClick={() => handleClick(key)}
                                    >
                                        {key}
                                    </TableCell>
                                    <TableCell>{incident.opened}</TableCell>
                                    <TableCell>{incident.Short_description}</TableCell>
                                    <TableCell>{incident.caller}</TableCell>
                                    <TableCell>{incident.priority}</TableCell>
                                    <TableCell>{incident.state}</TableCell>
                                    <TableCell>{incident.category}</TableCell>
                                    <TableCell>{incident.assigned_to}</TableCell>
                                    <TableCell>{incident.updated}</TableCell>
                                    <TableCell>{incident.updated_by}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
        </div>
    </div>
  );
}