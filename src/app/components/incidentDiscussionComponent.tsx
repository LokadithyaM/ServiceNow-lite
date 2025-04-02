"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, Button } from "@mui/material";
import { useState } from "react";
import UserSelect from "@/components/dbsearch";
import LexicalEditor from "@/components/lexicaleditor";
import Group from "@/email/temp"

export default function IncidentDiscussion() {
    const searchParams = useSearchParams();
    const encodedData = searchParams.get("data");
    const router = useRouter();

    const [messages, setMessages] = useState<string[]>([]);

    const handlePost = (message: string) => {
      console.log("Posted Message:", message);
      setMessages((prev) => [...prev, message]); // Store messages in state
        
    };

    const [formData, setFormData] = useState({
        Short_description: "",
        description: "",
        priority: "",
        state: "",
        category: "",
        assigned_to: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
      ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    

    if (!encodedData) return <p>Error: No incident data received</p>;

    // Decode the incident JSON
    const incident = JSON.parse(decodeURIComponent(encodedData));
    const check = JSON.parse(JSON.stringify(incident)); 


    const handleUpdate = async () => {
        if (incident.priority !== formData.priority || formData.assigned_to !== check.assigned_to) {
            if(formData.assigned_to === ""){
                formData.assigned_to = incident.assigned_to;
            }

            if(formData.priority === ""){
                formData.priority = incident.priority;
            }
            try {
                const res = await fetch("/api/updateDB", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        incidentId: incident.id,
                        priority: formData.priority,
                        assignedTo: formData.assigned_to,
                    }),
                    credentials: "include",
                });
    
                if (!res.ok) {
                    const errorData = await res.json();
                    alert(errorData.message);
                    return;
                }
    
                alert("Incident updated successfully!");
            } catch (error) {
                console.error("Error updating incident:", error);
                alert("An error occurred while updating the incident.");
            }
        }
    
        await router.push("/taskList");
    };

    const handleResolved = async () =>{
        const res = await fetch("/api/resolved", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                incidentId: incident.id,
            }),
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message);
            return;
        }

        alert("Oh congrats! If this was a mistake, your admin can restore the incident back. Cheers!");
        router.push("/taskList");
    }
    
    return (
        <div className="min-h-screen w-full flex flex-col gap-4 items-center justify-start p-3">
            <div className="border-2 h-auto w-full max-w-6xl p-4 bg-white shadow-md rounded-lg">
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h2 className="text-xl font-semibold">Incident Discussion</h2>
                    <Image
                        onClick={() => router.push("/taskList")}
                        className="dark:invert object-contain cursor-pointer"
                        src="/wrong.svg"
                        alt="Close"
                        height={30}
                        width={30}
                    />
                </div>
                <div className="grid grid-cols-1 mb-4 sm:grid-cols-2 gap-6">
                    <TextField label="Incident ID" value={incident.id} disabled fullWidth />
                    <TextField label="Caller" value={incident.caller} disabled fullWidth />
                    <TextField label="Category" value={incident.category} disabled fullWidth />
                    <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            name="priority"
                            value={formData.priority || incident.priority}
                            onChange={handleChange}
                        >
                            <MenuItem value="Critical">1 - Critical</MenuItem>
                            <MenuItem value="High">2 - High</MenuItem>
                            <MenuItem value="Medium">3 - Medium</MenuItem>
                            <MenuItem value="Low">4 - Low</MenuItem>
                        </Select>
                    </FormControl>
                    <UserSelect
                        value={formData.assigned_to || incident.assigned_to}
                        onChange={(name) => setFormData((prev) => ({ ...prev, assigned_to: name }))}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <TextField label="Short Description" value={incident.Short_description} fullWidth multiline rows={2} disabled className="mt-4"/>
                    <TextField label="Description" value={incident.description} fullWidth multiline rows={4} disabled className="mt-4"/>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    <Button variant="contained" color="success" onClick={handleUpdate}>Update</Button>
                    <Button variant="contained" color="success" onClick={handleResolved}>Mark Resolved</Button>
                </div>
            </div>
            <div className="border-2 h-auto w-full max-w-6xl p-4 bg-white shadow-md rounded-lg mt-6">
                <Group/>
                <LexicalEditor onPostAction={handlePost} onPost={function (message: string): void {
                } } />
                <h3 className="text-lg font-semibold mt-4">Work Notes:</h3>
                <ul className="border-t mt-2 pt-2">
                    {messages.map((msg, index) => (
                        <li key={index} className="p-2 border-b">{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
