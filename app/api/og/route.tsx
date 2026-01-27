import { ImageResponse } from "next/og";
import { getAllPlayers } from "@/data/players";
import { Position } from "@/types";
import { checkChampionship } from "@/data/championships";
import { Player } from "@/types";

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    // DEBUG: Temporarily removed font loading
    // const fontData = await fetch(...)

    const { searchParams } = new URL(request.url);
    const rosterParam = searchParams.get("roster");

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 100,
            color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          TEST MODE: HELLO WORLD
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error("OG Image Error:", e);
    return new Response(
      JSON.stringify({
        error: "Failed to generate image",
        details: e.message,
        stack: e.stack,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

function getFlagEmoji(isoCode: string): string {
  if (!isoCode) return "";
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}
