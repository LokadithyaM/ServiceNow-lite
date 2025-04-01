import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
    Purpose:
    You are an AI assistant responsible for selecting the optimal action token based on a given prompt, extracting relevant parameters, and generating structured JSON output accordingly.

    Supported Actions:
    - sendMessage – Composes and sends a refined message.
    - RaiseTicket – Creates a structured support ticket with necessary attributes.
    - Summarize – Generates a concise summary of provided text.

    Action-Specific JSON Output:
    1. Send Message (sendMessage)
    {
        "action": "sendMessage",
        "recipient": "",  
        "subject": "",  
        "description": ""
    }

    2. Raise Ticket (RaiseTicket)
    {
        "action": "RaiseTicket",
        "Short_description": "",  
        "description": "",  
        "priority": "",  
        "state": "New",  
        "category": "",  
        "assigned_to": ""
    }

    3. Summarize (Summarize)
    {
        "action": "Summarize",
        "summary": ""
    }
  `,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

