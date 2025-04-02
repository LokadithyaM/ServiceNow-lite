import { NextRequest, NextResponse } from "next/server";
import { Chat, Message } from "@/lib/chatSchema"; // Adjust path if needed
import { connectToDatabase } from "@/lib/mongodb";
import Redis from "@/lib/redis";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const { secondPerson, action, message } = await req.json();

    // Validate session
    const sessionToken = (await cookies()).get("session_token")?.value;
    if (!sessionToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const sessionKey = `session:${sessionToken}`;
    const sessionDataRaw = await Redis.get(sessionKey);
    if (!sessionDataRaw) return NextResponse.json({ message: "Session expired or not found" }, { status: 401 });

    const sessionData = JSON.parse(sessionDataRaw);
    const userId = sessionData.userId;

    if (!secondPerson) return NextResponse.json({ message: "Invalid second person" }, { status: 400 });

    // Unique chat ID
    const chatId = [userId, secondPerson._id].sort().join("#");

    if (action === "create_New_Message") {
        let chat = await Chat.findOne({ chatId });

        if (!chat) {
            chat = new Chat({
                chatId,
                participants: [userId, secondPerson],
                unseenCount: {},
            });
            await chat.save();
        }

        if (!message) return NextResponse.json({ message: "Message content is required" }, { status: 400 });

        const newMessage = new Message({
            chatId,
            senderId: userId,
            receiverId: secondPerson,
            content: message,
            timestamp: new Date(),
        });

        await newMessage.save();

        await Chat.updateOne(
            { chatId },
            {
                $inc: { [`unseenCount.${secondPerson}`]: 1 },
                $set: { lastMessage: message },
            }
        );

        return NextResponse.json({ message: "Message sent" }, { status: 201 });
    }

    if (action === "addUnseen") {
        await Chat.updateOne(
            { chatId },
            { $inc: { [`unseenCount.${secondPerson}`]: 1 } }
        );
        return NextResponse.json({ message: "Unseen count updated" }, { status: 200 });
    }

    if (action === "markVisited") {
        await Chat.updateOne(
            { chatId },
            { $set: { [`unseenCount.${userId}`]: 0 } }
        );
        return NextResponse.json({ message: "Messages marked as seen" }, { status: 200 });
    }

    if (action === "fetchAll") {
        const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
        return NextResponse.json({ messages }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
