import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload.email !== "string" || !payload.email.includes("@")) {
    return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
  }

  return NextResponse.json({ message: "Thanks — your note is on its way." }, { status: 201 });
}
