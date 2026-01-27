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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#091428", // Solid color only
            color: "white",
            // fontFamily removed - letting system default handle it
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              marginBottom: 40,
              fontSize: 32,
              fontWeight: "bold",
              color: "#C8AA6E",
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
            }}
          >
            {POSITIONS.map((pos, index) => {
              const player = rosterPlayers[pos];
              const marginRight = index < POSITIONS.length - 1 ? 20 : 0;

              if (!player) {
                // Empty Slot
                return (
                  <div
                    key={pos}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: 200,
                      height: 300,
                      backgroundColor: "#1e2328",
                      border: "2px dashed #485363",
                      borderRadius: 15,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: marginRight,
                    }}
                  >
                    <div style={{ color: "#485363", fontSize: 20 }}>?</div>
                    <div style={{ color: "#485363", fontSize: 14, marginTop: 5 }}>
                      {pos}
                    </div>
                  </div>
                );
              }

              // Player Card
              const isWinner =
                player.isWinner && player.championshipLeague === "WORLDS";
              const borderColor = isWinner
                ? "#FFD700" // Gold
                : player.teamColor || "#C8AA6E";

              return (
                <div
                  key={pos}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: 200,
                    height: 300,
                    backgroundColor: "#1e2328",
                    borderRadius: 15,
                    border: `4px solid ${borderColor}`,
                    marginRight: marginRight,
                    // valid simple relative positioning
                    position: "relative",
                  }}
                >
                  {/* Position Label (Flow instead of Absolute if possible, but Absolute is nicer) */}
                  {/* Trying simple flow layout for max safety this time */}
                  <div
                    style={{
                      display: "flex",
                      paddingTop: 10,
                      paddingLeft: 15,
                      fontSize: 12,
                      fontWeight: "bold",
                      color: isWinner ? "#FFD700" : "#C8AA6E",
                    }}
                  >
                    {player.position}
                  </div>

                  {/* Player Name */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: "900",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {player.name}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        opacity: 0.7,
                        marginTop: 5,
                        color: "#F0E6D2",
                      }}
                    >
                      {player.nationality}
                    </div>
                  </div>

                  {/* Team & Year Badge */}
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                      backgroundColor: "rgba(0,0,0,0.3)",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: player.teamColor || "#333",
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: 12,
                        color: "white",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {player.teamShort}
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: isWinner ? "#FFD700" : "#C8AA6E",
                      }}
                    >
                      {player.year}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 20,
              color: "#6b7280",
              fontSize: 16,
            }}
          >
            leagueofgacha.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
