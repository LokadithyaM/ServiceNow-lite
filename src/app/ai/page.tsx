"use client";

import { useEffect, useState } from "react";

export default function AI() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const [data, setData] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch("/api/allowedUsers"); 
              const result = await response.json();
              setData(result);
              console.log(result);
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };

      fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!prompt) return;

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const fullData = JSON.parse(data.response);
      
          if (fullData.action === "sendMessage") {
              console.log("congrats");
              console.log(fullData);
          }else if (fullData.action === "RaiseTicket") {
              console.log("congrats2");
              console.log(fullData);
      
              const newFormData = {
                  Short_description: fullData.Short_description || "",
                  description: fullData.description || "",
                  priority: fullData.priority || "",
                  state: fullData.state || "",
                  category: fullData.category || "",
                  assigned_to: fullData.assigned_to || "",
              };
      
              const response = await fetch("/api/incidnets", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                      action: "add_incident",
                      incident: newFormData,
                  }),
                  credentials: "include",
              });
      
              console.log(response);

        
          }else if (fullData.action === "Summarize") {
              console.log("congrats3");
              console.log(fullData);
          }

      setResponse(fullData.action+" that works i believe over and out.");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Error fetching AI response.");
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <div className="m-2 w-[500px] h-[200px] flex flex-col items-end">
        {response && (
          <pre className="mt-4 p-2 bg-gray-100 border rounded">{response}</pre>
        )}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handleSubmit}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
