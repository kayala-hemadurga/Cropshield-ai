import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.CROP_HEALTH_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Demo mode: CROP_HEALTH_API_KEY not configured on server." },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const apiFormData = new FormData();
    apiFormData.append("images", image);
    // Common params for crop.health; keep minimal
    apiFormData.append("language", "en");

    const res = await fetch("https://crop.kindwise.com/api/v1/health_assessment", {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
      },
      body: apiFormData,
    });

    const contentType = res.headers.get("content-type") || "";
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Crop.health API error (${res.status}): ${text.slice(0, 200)}` },
        { status: res.status },
      );
    }

    if (contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    const text = await res.text();
    return NextResponse.json({ raw: text });
  } catch (error) {
    console.error("crop-health route error:", error);
    return NextResponse.json({ error: "Failed to call crop.health API." }, { status: 500 });
  }
}
