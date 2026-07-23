// app/api/nvidia/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { apiKey, model, prompt } = await req.json();

    if (!apiKey || !model || !prompt) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 4000,
        }),
      },
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      // Nvidia sometimes nests errors in 'detail' or 'message'
      const errMsg =
        errData.detail ||
        errData.message ||
        JSON.stringify(errData) ||
        "Nvidia API Error";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ content: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to Nvidia API" },
      { status: 500 },
    );
  }
}
