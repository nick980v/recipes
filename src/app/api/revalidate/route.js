import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Revalidate by cache tag (more efficient than individual paths)
    revalidateTag("recipes");

    // Also revalidate specific paths for immediate updates
    revalidatePath("/"); // 🔥 Clears the cache for "/"
    revalidatePath("/tags/mains");
    revalidatePath("/tags/sides");
    revalidatePath("/tags/breakfast");
    revalidatePath("/tags/desserts");

    return NextResponse.json({ message: "Revalidation triggered" });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { message: "Error triggering revalidation" },
      { status: 500 }
    );
  }
}
