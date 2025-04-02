import { cookies } from "next/headers";
import Redis from "@/lib/redis"; // Adjust the import path based on your project
import { NextResponse } from "next/server";

export async function GET() {
    const sessionToken = (await cookies()).get("session_token")?.value;
    if (!sessionToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sessionKey = `session:${sessionToken}`;
    const sessionDataRaw = await Redis.get(sessionKey);

    if (!sessionDataRaw) {
        return NextResponse.json({ message: "Session expired or not found" }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionDataRaw);
    // console.log(sessionData);
    return NextResponse.json(sessionData);
}
