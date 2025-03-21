"use client";
import { useState } from "react";
// import Search from "@/components/search"
import LexicalEditor from "@/components/lexicaleditor";
import { TextField, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, Button } from "@mui/material";
import { useRouter } from "next/navigation";
// import router from "next/router";


export default function Form() {
  const router = useRouter();
  // State to manage form data
  const [formData, setFormData] = useState({
    Short_description: "",
    description: "",
    priority: "",
    state: "",
    category: "",
    assignedTo: "",
    assignmentGroup: "",
  });

  interface Message {
    id: number;
    text: string;
  }
  
  const [messages, setMessages] = useState<Message[]>([]);

  const [errors, setErrors] = useState({
    Short_description: false,
    category: false,
  });
  

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle button actions
  const handleSubmit = async () => {
    const newErrors = {
      Short_description: !formData.Short_description,
      category: !formData.category,
    };
  
    setErrors(newErrors);
  
    // If any field has an error, do not proceed
    if (Object.values(newErrors).some((error) => error)) {
      console.log("Validation failed");
      return;
    }

    try {
      const response = await fetch("/api/incidnets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              action: "add_incident",
              incident: formData,
          }),
          credentials: "include",
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${await response.text()}`);
      }

      router.push("/taskList");
      // const data = await response.json();
      // console.log("Incident added successfully:", data);
    } catch (error) {
        console.error("Failed to add incident:", error);
    }
  
  };


  
  const handlePostMessage = (message: string) => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { id: prev.length + 1, text: message }]); // Store message
    }
  };

  return (
    <div className="border-2 border-white bg-white flex flex-col items-center justify-items-center min-h-screen">
      {/* Mini Navigation Bar */}

      <div className="flex bg-white justify-between gap-4 bg-black p-4 h-[80px] rounded-lg w-full border-2 border-black">
        <div className="w-[230px] h-auto text-center text-2xl black">Incident: INC1111 </div>
        <div className="flex gap-2">
          <Button variant="contained" color="success" onClick={handleSubmit}>Submit</Button>
        </div>
      </div>

      <div className="w-full bg-white shadow-black shadow-xl border-2 border-black">
      {/* Form Container */}
      <div className="border-2 border-white bg-white p-8 rounded-lg w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          
          
          {/* Priority */}
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={formData.priority} onChange={handleChange}>
              <MenuItem value="1">1 - Critical</MenuItem>
              <MenuItem value="2">2 - High</MenuItem>
              <MenuItem value="3">3 - Medium</MenuItem>
              <MenuItem value="4">4 - Low</MenuItem>
            </Select>
          </FormControl>
          
          {/* State */}
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select name="state" value={formData.state} onChange={handleChange}>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          
          {/* Category */}
          <FormControl fullWidth error={errors.category}>
            <InputLabel>
              Category <span style={{ color: 'red' }}>*</span>
            </InputLabel>
            <Select name="category" value={formData.category} onChange={handleChange}>
              <MenuItem value="Help">Need Help</MenuItem>
              <MenuItem value="inquiry">Inquiry</MenuItem>
              <MenuItem value="announcement">Announcement</MenuItem>
            </Select>
            {errors.category && <p className="text-red-500 text-sm">This field is required</p>}
          </FormControl>


          <FormControl fullWidth>
            <InputLabel>group Assigned to</InputLabel>
            <Select name="assignmentGroup" value={formData.assignmentGroup} onChange={handleChange}>
              <MenuItem value="developer">developer</MenuItem>
              <MenuItem value="analyst">analyst</MenuItem>
              <MenuItem value="manager">manager</MenuItem>
              <MenuItem value="webmaster">webmaster</MenuItem>
            </Select>
          </FormControl>
          
          {/* Assigned To */}
          <FormControl fullWidth>
            <InputLabel>Assigned to</InputLabel>
            <Select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
              <MenuItem value="67cbdc8ec3be41391b901643">Penelope Watson</MenuItem>
              <MenuItem value="67cbdc8ec3be41391b901644">Julian Brooks</MenuItem>
              <MenuItem value="67cbdc8ec3be41391b901645">Chloe Kelly</MenuItem>
              <MenuItem value="67cbdc8ec3be41391b901642">Luke James</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* <Search/> */}
        

        {/* Short Description */}
        <div className="mb-4">
          <TextField
            label={
              <>
                Short Description <span style={{ color: 'red' }}>*</span>
              </>
            }
            name="Short_description"
            value={formData.Short_description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            error={errors.Short_description}
            helperText={errors.Short_description ? "This field is required" : ""}
          />
        </div>

          
        {/* Detailed Description */}
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} variant="outlined" />
      </div>
      </div>

      <div className="border-2 border-black bg-white p-8 rounded-lg w-full h-auto text-2xl shadow-black shadow-xl">
          <Chat email=""/>
      </div>
    </div>
  );



  function Chat({ email }: { email: string }) {
    // const [messages, setMessages] = useState<Message[]>([]);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  
    return (
      <div className="p-4 border rounded-lg w-full h-auto m-2">
        {/* Header */}
        <div className="border-2 flex border-gray-300 w-full h-[50px] m-2 rounded-lg items-center">
          <h2 className="pl-2 text-black text-2xl font-bold tracking-tight">
            Notes
          </h2>
        </div>
  
        {/* Scrollable Messages Area */}
        <div className="space-y-3 overflow-y-auto h-[60vh] p-4 mb-4 border rounded-md bg-gray-100">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-2 rounded-md shadow-md">
              {msg.text}
            </div>
          ))}
        </div>
  
        {/* LexicalEditor with callback */}
        <div>
          <LexicalEditor onPostAction={handlePostMessage} onPost={function (message: string): void {
            throw new Error("Function not implemented.");
          } } />
        </div>
      </div>
    );
  }
}