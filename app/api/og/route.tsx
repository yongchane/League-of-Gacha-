import { ImageResponse } from "next/og";
import { getAllPlayers } from "@/data/players";
import { Position } from "@/types";
import { checkChampionship } from "@/data/championships";
import { Player } from "@/types";

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    // Disabled font loading to ensure stability
    // const fontData = await fetch(...);

    const { searchParams } = new URL(request.url);
    const rosterParam = searchParams.get("roster");

    if (!rosterParam) {
      return new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#091428",
              backgroundImage:
                "linear-gradient(to bottom right, #091428, #0a0a0c)",
              color: "#C8AA6E",
            }}
          >
            <div style={{ fontSize: 60, fontWeight: 700, marginBottom: 20 }}>
              LEAGUE OF GACHA
            </div>
            <div style={{ fontSize: 30, color: "#F0E6D2" }}>
              Create your own legendary roster
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    const playerIds = rosterParam.split(",");
    const allPlayers = getAllPlayers();
    const rosterPlayers: Partial<Record<Position, Player>> = {};

    POSITIONS.forEach((position, index) => {
      const playerId = playerIds[index];
      if (playerId && playerId !== "empty") {
        const player = allPlayers.find((p) => p.id === playerId);
        if (player) {
          rosterPlayers[position] = player;
        }
      }
    });

    const players = Object.values(rosterPlayers) as Player[];

    // Check for championship
    let championship = null;
    if (players.length === 5) {
      const playerNames = players.map((p) => p.name);
      const team = players[0].teamShort;
      const year = players[0].year;
      const sameTeamYear = players.every(
        (p) => p.teamShort === team && p.year === year
      );
      if (sameTeamYear) {
        championship = checkChampionship(playerNames, team, year);
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            backgroundColor: "white", // Safety Root
          }}
        >
          {/* WRAPPER: Back to Safe Named Colors */}
          <div
            style={{
              display: "flex",
              height: "100%",
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "black", // User confirmed this works
              color: "white",
            }}
          >
            {/* Title */}
            <div
              style={{
                display: "flex",
                marginBottom: 40,
                fontSize: 32,
                fontWeight: "bold",
                color: "gold", // User confirmed this works
              }}
            >
              LEAGUE OF GACHA
            </div>

            {/* Cards Container */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {POSITIONS.map((pos, index) => {
                const player = rosterPlayers[pos];
                const marginRight = index < POSITIONS.length - 1 ? 20 : 0;

                return (
                  <div
                    key={pos}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: 200,
                      height: 300,
                      backgroundColor: "navy", // User confirmed this works
                      border: "3px solid gold", // User confirmed this works
                      borderRadius: 15,
                      marginRight: marginRight,
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "gold" }}>
                      {pos}
                    </div>
                    
                    {player ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: '900', textAlign: 'center', color: "white" }}>
                          {player.name}
                        </div>
                        <div style={{ fontSize: 14, color: "silver", marginTop: 5 }}>
                          {player.nationality}
                        </div>
                        <div style={{ fontSize: 14, color: "gold", marginTop: 10, fontWeight: "bold" }}>
                          {player.teamShort} • {player.year}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 20, color: "gray" }}>?</div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div style={{ marginTop: 20, fontSize: 16, display: 'flex', color: "gray" }}>
              leagueofgacha.com - v5.0 SAFE MODE
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        }
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
