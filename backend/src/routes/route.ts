// app/api/faults/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const faults = [
    { id: 1, name: "Overheating", status: "critical" },
    { id: 2, name: "Low Voltage", status: "warning" }
  ];

  return NextResponse.json(faults);
}
