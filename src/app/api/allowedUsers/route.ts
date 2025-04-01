import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/lib/redis";

export async function GET(req: NextRequest) {
    const sessionToken = req.cookies.get("session_token")?.value;
    if (!sessionToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    

    const sessionData = await redisClient.get(`session:${sessionToken}`);
    if (!sessionData) {
        return NextResponse.json({ message: "Session expired. Please log in again." }, { status: 401 });
    }

    const { companyId } = JSON.parse(sessionData);
    if (!companyId) {
        return NextResponse.json({ message: "Company ID missing from session." }, { status: 400 });
    }

    const cachedUsers = await redisClient.get(`allowed_users:${companyId}`);

    if (!cachedUsers) {
        return NextResponse.json({ message: "Allowed users not found in cache." }, { status: 404 });
    }

    return NextResponse.json({ allowedUsers: JSON.parse(cachedUsers) });
}
