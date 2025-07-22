import axios from "axios";
import { getAccessToken } from "@/actions/token";
import { baseURL } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid or missing chapter id" },
      { status: 400 }
    );
  }

  try {
    const token = await getAccessToken();

    if (!token) {
      return NextResponse.json(
        { error: "Failed to retrieve access token" },
        { status: 401 }
      );
    }

    const response = await axios.get(`${baseURL}/chapters/${id}`, {
      headers: {
        "x-auth-token": token.access_token,
        "x-client-id": token.client_id,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    let message = "Internal Server Error";

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.error_description ||
        error.response?.data?.message ||
        error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
