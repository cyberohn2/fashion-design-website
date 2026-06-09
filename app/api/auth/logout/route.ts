import { NextResponse } from "next/server";
import { logoutUser } from "@/actions/auth/logout";

export async function POST(request: Request) {
    const loggedOut = await logoutUser();

    if (loggedOut.success) {
        return NextResponse.json({ success: true }, { status: 200 });
    } else {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}