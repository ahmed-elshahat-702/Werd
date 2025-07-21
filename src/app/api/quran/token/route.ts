import { getAccessToken } from "@/actions/token";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await getAccessToken();

    if (!token) {
      return NextResponse.json(
        { error: "Failed to retrieve access token" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      access_token: token.access_token,
      client_id: token.client_id,
    });
  } catch (err: unknown) {
    let message = "Internal Server Error";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
