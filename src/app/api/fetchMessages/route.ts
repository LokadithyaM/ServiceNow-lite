import { NextRequest, NextResponse } from "next/server";
import Chat from "@/lib/chatSchema";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { sender, receiver} = await req.json();

  if (!sender || !receiver) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectToDatabase();

  const participants = [sender, receiver].sort();

  const hash = crypto
    .createHash("sha256")
    .update(participants.join("_"))
    .digest("hex");

  // Try to update existing chat session
  const chat = await Chat.findOne({ chatId: hash });

  return NextResponse.json({ success: true, chat });
}
