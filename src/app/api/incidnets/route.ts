import { NextRequest, NextResponse } from "next/server";
import Admin from "@/lib/admin";
import { connectToDatabase } from "@/lib/mongodb";
import Redis from "@/lib/redis";
import { cookies } from "next/headers";
import redisClient from "@/lib/redis";

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

    // console.error(sessionData.companyId);
    
    interface Incident {
        assigned_to: string;
        Short_description: string;
        description: string;
        priority: string;
        state: string;
        category: string;
        id?: string;
        createdBy?: string;
    }

    const { action,incident } = await req.json();

    if (action === "fetch_Incident_Id") {
        const company = await Admin.findOne({_id: sessionData.companyId});

        // console.log(company.incidents);
        let incidents: Record<string, Incident> = company.incidents || {};

        return NextResponse.json({incidents}, { status: 200 });
    }

    if(action==="add_incident"){
        const company = await Admin.findOne({_id: sessionData.companyId});
        const incidents: Record<string, Incident> = company.incidents || {};

        // Get the highest existing number
        const highestId = Object.keys(incidents)
            .map(id => parseInt(id.replace("INC0", ""), 10)) // Extract numbers from keys
            .filter(num => !isNaN(num)) // Remove NaN values
            .reduce((max, num) => Math.max(max, num), 0); // Find max number

        const newId = `INC0${highestId + 1}`;

        // const newId = `INC0${Object.keys(incidents).length + 1}`;
        // const newId = `INC019`;
        // console.error(incident);



        const newIncident: Incident = {

            ...incident,
            id: newId,
            caller: sessionData.userName,
            opened: new Date().toISOString(),
            // assignedTo: incident.assigned_to,
        };        
        console.error(newIncident);
        

        incidents[newId] = newIncident;

        await Admin.updateOne(
            { _id: sessionData.companyId },
            { $set: { incidents: incidents } }
        );

        // console.error(newIncident);

        return NextResponse.json({ status: 201 });
    }


    // return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
