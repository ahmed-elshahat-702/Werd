import axios from "axios";
import { getAccessToken } from "@/actions/token";
import { baseURL } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid or missing chapter number" },
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

    // Convert searchParams to an object
    const queryParams = Object.fromEntries(searchParams);

    const response = await axios.get(`${baseURL}/verses/by_chapter/${id}`, {
      headers: {
        "x-auth-token": token.access_token,
        "x-client-id": token.client_id,
      },
      params: {
        language: "en",
        words: true,
        translations: "131",
        tafsirs: "169",
        fields: [
          "text_uthmani",
          "text_uthmani_simple",
          "text_imlaei",
          "text_imlaei_simple",
          "text_indopak",
          "text_uthmani_tajweed",
          "image_url",
          "image_width",
          "page_number",
        ].join(","),
        word_fields: ["text_uthmani_simple", "code_v1", "line_number"].join(
          ","
        ),
        ...queryParams, // Spread all query parameters
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
