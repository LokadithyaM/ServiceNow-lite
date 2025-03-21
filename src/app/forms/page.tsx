"use client";
import { useState } from "react";
// import Search from "@/components/search"
import Image from "next/image";
import UserSelect from "@/components/dbsearch"
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
    assigned_to: "",
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
    formData.state="new";
  
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


  return (
    <div className="border-2 border-white bg-white flex flex-col items-center justify-center min-h-screen">

      <div className="w-[800px] bg-white shadow-black shadow-xl border-2 border-black rounded-lg">

        <div className="flex w-full h-fit justify-end ">  
          <div className="flex bg-gray-200 items-center justify-between bg-black p-2 h-[50px] rounded-lg w-full">
            <h1 className="text-2xl">New Incident</h1>
            <div className="flex gap-2">
              <Image
                onClick={() => router.push("/taskList")}
                className="dark:invert object-contain cursor-pointer"
                src="/crosssB.svg"
                alt="Logo"
                height={50}
                width={50}
              />
            </div>
          </div>
        </div>

      <div className="border-2 border-white bg-white p-8 rounded-lg w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={formData.priority} onChange={handleChange}>
              <MenuItem value="Critical">1 - Critical</MenuItem>
              <MenuItem value="High">2 - High</MenuItem>
              <MenuItem value="Medium">3 - Medium</MenuItem>
              <MenuItem value="Low">4 - Low</MenuItem>
            </Select>
          </FormControl>
          
          {/* State */}
          <FormControl fullWidth>
            <TextField label="State" value="New" disabled />
          </FormControl>
                    
          {/* Category */}
          <FormControl fullWidth error={errors.category}>
            <InputLabel>
              Category <span style={{ color: 'red' }}>*</span>
            </InputLabel>
            <Select name="category" value={formData.category} onChange={handleChange}>
              <MenuItem value="Issue">Problem</MenuItem>
              <MenuItem value="Inquiry">Inquiry</MenuItem>
              <MenuItem value="Core_Feature">CoreFeature</MenuItem>
            </Select>
            {errors.category && <p className="text-red-500 text-sm">This field is required</p>}
          </FormControl>

          <UserSelect
            value={formData.assigned_to}
            onChange={(name) => setFormData((prev) => ({ ...prev, assigned_to: name }))}
          />


        </div>

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

        
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} variant="outlined" />
      </div>
      <div className="flex w-full h-fit justify-end ">  
        <div className="flex bg-white justify-end bg-black p-4 pr-[30px] h-[80px] rounded-lg w-[400px]">
            <div className="flex gap-2">
              <Button variant="contained" color="success" onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      </div>   
    </div>
  );
}