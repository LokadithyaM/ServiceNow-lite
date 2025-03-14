import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Redis from "@/lib/redis";

export async function GET() {
    try {
        const sessionToken = (await cookies()).get("session_token")?.value;
        console.log(sessionToken);

        if (!sessionToken) {
            return NextResponse.json({ session: null }, { status: 401 });
        }

        const session = await Redis.get(`session:${sessionToken}`);
        

        if (!session) {
            return NextResponse.json({ session: null }, { status: 401 });
        }

        return NextResponse.json({ session: JSON.parse(session) });
    } catch (error) {
        console.error("Error fetching session", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
