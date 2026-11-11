import { withOperator } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getRadarData, runRadarScan } from "@/lib/radar-engine";

export const dynamic = "force-dynamic";

async function handleGET() {
  const radarItems = await getRadarData();
  return NextResponse.json({
    success: true,
    count: radarItems.length,
    scannedAt: radarItems[0]?.lastScannedAt || new Date().toISOString(),
    items: radarItems,
  });
}

async function handlePOST() {
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


export const GET = withOperator(handleGET);
export const POST = withOperator(handlePOST);
