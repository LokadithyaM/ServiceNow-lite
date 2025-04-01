"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, Button } from "@mui/material";
import { useState } from "react";
import UserSelect from "@/components/dbsearch";
import LexicalEditor from "@/components/lexicaleditor";

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
            if(formData.assigned_to===""){
                formData.assigned_to=incident.assigned_to;
            }

            if(formData.priority ===""){
                formData.priority=incident.priority;
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

        alert("oh congrats well if this was a mistake your admin can restore the incident back cheers!");

        router.push("/taskList");
    }
    
    return (
        <div className="min-h-screen w-full flex flex-col gap-4 items-center justify-start p-3">
            <div className="flex gap-2">
            <div className="border-2 h-full w-full">
                <div className="h-auto w-[1500px] gap-4  border-2">
                    <div className="border-2 mb-2 h-[50] p-2 flex items-center justify-between w-full">
                        <div className="text-2xl">ID: {incident.id}</div>
                        <div className="flex gap-2">
                            <Image
                                onClick={() => router.push("/taskList")}
                                className="dark:invert object-contain cursor-pointer"
                                src="/wrong.svg"
                                alt="Logo"
                                height={50}
                                width={50}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center space-x-4 w-full">
                            <h1 className="text-lg font-semibold whitespace-nowrap">Incident ID:</h1>
                            <TextField className="bg-gray-200 rounded flex-grow" value={incident.id} disabled />
                        </div>


                        <FormControl fullWidth>
                            {/* <TextField label="State" value="New" disabled /> */}
                        </FormControl>
                        <div className="flex items-center space-x-4 w-full">
                            <h1 className="text-lg font-semibold whitespace-nowrap">State:</h1>
                            <TextField className="bg-gray-200 rounded flex-grow" value="New" disabled />
                        </div>


                        

                        <div className="flex items-center space-x-4 w-full">
                            <h1 className="text-lg font-semibold whitespace-nowrap">Caller:</h1>
                            <TextField className="bg-gray-200 rounded flex-grow" value={incident.caller} disabled />
                        </div>


                        <FormControl fullWidth>
                            {/* <TextField label="State" value="New" disabled /> */}
                        </FormControl>

                        <div className="flex items-center space-x-4 w-full">
                            <h1 className="text-lg font-semibold whitespace-nowrap">Category:</h1>
                            <TextField className="bg-gray-200 rounded flex-grow" value={incident.category} disabled />
                        </div>



                        <div className="flex items-center space-x-4 w-full">
                            <h1 className="text-lg font-semibold whitespace-nowrap">Priority:</h1>
                            <Select
                                name="priority"
                                value={formData.priority || incident.priority}
                                onChange={handleChange}
                                className="rounded flex-grow"
                                displayEmpty
                            >
                                <MenuItem value="" disabled>Select Priority</MenuItem>
                                <MenuItem value="Critical">1 - Critical</MenuItem>
                                <MenuItem value="High">2 - High</MenuItem>
                                <MenuItem value="Medium">3 - Medium</MenuItem>
                                <MenuItem value="Low">4 - Low</MenuItem>
                            </Select>
                        </div>


                        <FormControl fullWidth>
                            {/* <TextField label="State" value="New" disabled /> */}
                        </FormControl>

                        <div className="mb-4 flex gap-2 justify-between items-center">
                            <h1 className="text-lg font-semibold whitespace-nowrap">Assigned to:</h1>
                            <UserSelect
                                value={formData.assigned_to || incident.assigned_to}
                                onChange={(name) => setFormData((prev) => ({ ...prev, assigned_to: name }))}
                            />
                        </div>

                        {/* <div className="w-full h-full border-2 border-black"></div> */}

                    </div>


                    <div className="mb-4 flex gap-2 items-center">
                        <h1 className="text-lg font-semibold whitespace-nowrap">Short Description:</h1>
                        <TextField className="bg-gray-200"  name="Short_description" value={incident.Short_description} fullWidth multiline rows={2} variant="outlined" disabled/>
                    </div>
                    <div className="mb-4 flex gap-2 items-center">
                        <h1 className="text-lg font-semibold whitespace-nowrap">Description:</h1>
                        <TextField className="bg-gray-200" name="description" value={incident.description} fullWidth multiline rows={4} variant="outlined" disabled />
                    </div>
                    {/* <h1>Incident Discussion</h1>
                    <p><strong>ID:</strong> {incident.id}</p>
                    <p><strong>Description:</strong> {incident.Short_description}</p>
                    <p><strong>Caller:</strong> {incident.caller}</p>
                    <p><strong>Priority:</strong> {incident.priority}</p>
                    <p><strong>State:</strong> {incident.state}</p>
                    <p><strong>Category:</strong> {incident.category}</p>
                    <p><strong>Assigned To:</strong> {incident.assigned_to}</p>
                    {incident.updated}; */}
                    <div className="w-full h-[50px] border-2 border-black flex justify-end gap-2">
                        <Button variant="contained" color="success" onClick={handleUpdate}>Update</Button>

                        <Button variant="contained" color="success" onClick={handleResolved}>mark Resolved</Button>
                    </div>
                </div>
                </div>
            </div>
         <div className="min-h-screen w-full flex flex-col gap-4 items-center justify-start p-3">
            <LexicalEditor onPostAction={handlePost} onPost={function (message: string): void {} } /> {}
            <div className="border-2 h-full w-[1500px]">
                <h3>Posted Messages:</h3>
                <ul>
                    {messages.map((msg, index) => (
                    <li key={index} className="p-2 border-b">{msg}</li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    );
}
