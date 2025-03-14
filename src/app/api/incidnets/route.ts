import { NextRequest, NextResponse } from "next/server";
import Admin from "@/lib/admin";
import { connectToDatabase } from "@/lib/mongodb";
import Redis from "@/lib/redis";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    await connectToDatabase();

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
    if(!sessionData){
        return NextResponse.json({ message: "Session expired or not found" }, { status: 401 });
    }

    console.error(sessionData.companyId);

    const { action } = await req.json();

    if (action === "fetch_Incident_Id") {
        const cacheKey = `Incidents:${sessionData.companyId}`;

        // Check Redis Cache
        const cachedData = await Redis.get(cacheKey);
        let incidents: Record<string, any> = {};
        if (cachedData) {
            incidents = JSON.parse(cachedData);
        } else {
            // console.error(sessionData.companyId);
            // Fetch from MongoDB if not cached
            const company = await Admin.findOne({ _id: sessionData.companyId });

            console.error(company);

            incidents=company.incidents;

            await Redis.setEx(cacheKey, 86400, JSON.stringify(incidents));
        }

        console.log(incidents);

        return NextResponse.json({ incidents}, { status: 200 });
    }

    // return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
