// app/api/triage/route.ts
import { NextResponse } from "next/server";
import { analyzeSymptoms } from "@/app/lib/triageService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { symptoms } = body;

    if (!symptoms) {
      return NextResponse.json({ error: "Symptoms data is required" }, { status: 400 });
    }

    const triageResult = analyzeSymptoms(symptoms);

    return NextResponse.json(triageResult, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}