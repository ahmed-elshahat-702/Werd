import axios from "axios";
import { NextResponse } from "next/server";
import { baseURL } from "@/lib/constants";
import { getAccessToken } from "@/actions/token";

// Get chapters from the Quran Foundation API
async function getChapters(accessToken: string, clientId: string) {
  try {
    const response = await axios({
      method: "get",
      url: `${baseURL}/content/api/v4/chapters`,
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": clientId,
      },
    });

    return response.data;
  } catch (error: unknown) {
    let message = "Unknown error";
    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.error_description || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    console.error("Error fetching chapters:", message);
    throw new Error(message);
  }
}

// API route handler
export async function GET() {
  try {
    const res = await getAccessToken();

    const accessToken = res.access_token;
    const clientId = res.client_id;

    if (!accessToken || !clientId) {
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 500 }
      );
    }

    const chapters = await getChapters(accessToken, clientId);
    return NextResponse.json(chapters);
  } catch (err: unknown) {
    let message = "Internal Server Error";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
