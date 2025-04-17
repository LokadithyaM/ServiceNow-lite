import { NextRequest, NextResponse } from "next/server";
import Chat from "@/lib/chatSchema";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { sender, receiver, message, timestamp } = await req.json();

  if (!sender || !receiver || !message || !timestamp) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectToDatabase();

  // Sort sender and receiver alphabetically
  const participants = [sender, receiver].sort();

  // Hash the sorted participants to form a unique chatId
  const hash = crypto
    .createHash("sha256")
    .update(participants.join("_"))
    .digest("hex");

  const newMessage = {
    sender,
    message,
    timestamp: timestamp,
  };

  // Try to update existing chat session
  const chat = await Chat.findOneAndUpdate(
    { chatId: hash },
    {
      $push: { messages: newMessage },
      $set: { lastUpdated: new Date(), seenCount: 1, participants },
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, chat });
}
