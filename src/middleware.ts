import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    // Example: Allow all requests without modification
    return NextResponse.next();
}
