"use server";

import { authURL, clientId, clientSecret } from "@/lib/constants";
import axios from "axios";

export async function getAccessToken() {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await axios({
      method: "post",
      url: `${authURL}/oauth2/token`,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials&scope=content",
    });

    return {
      access_token: response.data.access_token,
      client_id: clientId,
    };
  } catch (error: unknown) {
    let message = "Unknown error";
    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.error_description || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    console.error("Error getting access token:", message);
    throw new Error(message);
  }
}
