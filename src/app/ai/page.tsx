"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AI() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
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
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const fullData = JSON.parse(data.response);

      if (fullData.action === "sendMessage") {
        console.log("Message sent:", fullData);
      } else if (fullData.action === "RaiseTicket") {
        console.log("Ticket Raised:", fullData);

        const newFormData = {
          Short_description: fullData.Short_description || "",
          description: fullData.description || "",
          priority: fullData.priority || "",
          state: fullData.state || "",
          category: fullData.category || "",
          assigned_to: fullData.assigned_to || "",
        };

        await fetch("/api/incidnets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add_incident", incident: newFormData }),
          credentials: "include",
        });
      } else if (fullData.action === "Summarize") {
        console.log("Summarizing:", fullData);
      }

      setResponse(fullData.action + " executed successfully.");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Error fetching AI response.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-full bg-gray-50 p-6">
      <Card className="w-full max-w-lg shadow-lg border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">AI Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          {response && (
            <div className="mb-4 p-3 bg-gray-100 border-l-4 border-blue-500 rounded text-gray-700">
              {response}
            </div>
          )}

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full p-2 border rounded resize-none"
            rows={4}
          />

          <Button onClick={handleSubmit} className="w-full mt-4" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : "Send"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
