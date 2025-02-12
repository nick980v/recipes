import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    revalidatePath("/"); // 🔥 Clears the cache for "/"

    return NextResponse.json({ message: "Revalidation triggered" });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { message: "Error triggering revalidation" },
      { status: 500 }
    );
  }
}
