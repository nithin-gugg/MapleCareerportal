import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.user.update({
      where: { id: session.id as string },
      data: {
        googleAccessToken: null,
        googleRefreshToken: null,
        googleEmail: null,
        tokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to disconnect Google account:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
