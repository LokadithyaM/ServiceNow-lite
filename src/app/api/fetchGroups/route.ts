import { NextRequest, NextResponse } from "next/server";
import Admin from "@/lib/admin";
import { connectToDatabase } from "@/lib/mongodb";
import Redis from "@/lib/redis";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    await connectToDatabase();

    // 🔹 Extract sessionToken from cookies
    const sessionToken = (await cookies()).get("session_token")?.value;
    // console.log(sessionToken);
    if (!sessionToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🔹 Fetch session data from Redis
    const sessionKey = `session:${sessionToken}`;
    const sessionDataRaw = await Redis.get(sessionKey);
    if (!sessionDataRaw) {
        return NextResponse.json({ message: "Session expired or not found" }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionDataRaw);
    const { companyId } = sessionData;

    // 🔹 Get the action from request body
    // const { action } = await req.json();

    // if (action === "fetchGroups") {
        const cacheKey = `roles:${companyId}`;
        let rolesGrouped;

        // Check Redis Cache
        const cachedData = await Redis.get(cacheKey);
        if (cachedData) {
            rolesGrouped = JSON.parse(cachedData);
        } else {
            // Fetch from MongoDB if not cached
            const company = await Admin.findOne({ _id: companyId });

            if (!company) {
                return NextResponse.json({ message: "Company not found" }, { status: 404 });
            }

            // 🔹 Group users by role
            rolesGrouped = company.allowedUsers.reduce((acc: { [x: string]: any[]; }, user: { role: string | number; _id: { toString: () => any; }; }) => {
                if (!acc[user.role]) {
                    acc[user.role] = [];
                }
                acc[user.role].push(user._id.toString()); // 🔹 Convert _id to string
                return acc;
            }, {});
            

            // Cache the grouped roles for 24h
            await Redis.setEx(cacheKey, 86400, JSON.stringify(rolesGrouped));
        }

        console.log(rolesGrouped);

        return NextResponse.json({ rolesGrouped }, { status: 200 });
    // }

    // return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
