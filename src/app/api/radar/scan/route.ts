import { NextResponse } from "next/server";
import { getRadarData, runRadarScan } from "@/lib/radar-engine";

export async function GET() {
  const radarItems = getRadarData();
  return NextResponse.json({
    success: true,
    count: radarItems.length,
    scannedAt: radarItems[0]?.lastScannedAt || new Date().toISOString(),
    items: radarItems,
  });
}

export async function POST() {
  try {
    const updated = await runRadarScan();
    return NextResponse.json({
      success: true,
      message: "GitHub Radar scan completed successfully.",
      count: updated.length,
      items: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute radar scan." },
      { status: 500 }
    );
  }
}
