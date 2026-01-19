import { NextResponse } from "next/server";

const endpoint = process.env.STRAPI_ENDPOINT;

export async function GET(request, { params }) {
  const { documentId } = await params;
  if (!endpoint || !process.env.STRAPI_TOKEN) {
    console.error("Strapi environment variables not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (!documentId) {
    return NextResponse.json(
      { error: "Recipe ID is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${endpoint}/${documentId}?populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      next: { revalidate: 86400 }, // Cache for 24 hours (86400 seconds)
    });

    if (!res.ok) {
      console.error(`Failed to fetch recipe ${documentId}:`, res.status);
      return NextResponse.json(
        { error: `Failed to fetch recipe: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching recipe ${documentId}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
