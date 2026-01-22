"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Player, Position, UserRoster } from "@/types";
import { getRandomPlayer } from "@/data/players";
import PlayerCard from "@/components/PlayerCard";
import {
  LazyMotion,
  domAnimation,
  m as motion,
  AnimatePresence,
} from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// 동적 import로 초기 번들 크기 감소
const GachaModal = dynamic(() => import("@/components/GachaModal"), {
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  ),
});

const GachaMultiModal = dynamic(() => import("@/components/GachaMultiModal"), {
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  ),
});

// 페이커 선수 데이터들
const FAKER_PLAYERS: Player[] = [
  {
    id: "faker_2013",
    name: "Faker",
    realName: "이상혁",
    position: "MID",
    year: 2013,
    teamShort: "SKT",
    teamFull: "SK Telecom T1",
    teamColor: "#E4002B",
    region: "LCK",
    nationality: "South Korea",
    iso: "kr",
    isWinner: true,
    championshipLeague: "WORLDS",
    championshipYear: 2013,
  },
  {
    id: "faker_2015",
    name: "Faker",
    realName: "이상혁",
    position: "MID",
    year: 2015,
    teamShort: "SKT",
    teamFull: "SK Telecom T1",
    teamColor: "#E4002B",
    region: "LCK",
    nationality: "South Korea",
    iso: "kr",
    isWinner: true,
    championshipLeague: "WORLDS",
    championshipYear: 2015,
  },
  {
    id: "faker_2016",
    name: "Faker",
    realName: "이상혁",
    position: "MID",
    year: 2016,
    teamShort: "SKT",
    teamFull: "SK Telecom T1",
    teamColor: "#E4002B",
    region: "LCK",
    nationality: "South Korea",
    iso: "kr",
    isWinner: true,
    championshipLeague: "WORLDS",
    championshipYear: 2016,
  },
  {
    id: "faker_2023",
    name: "Faker",
    realName: "이상혁",
    position: "MID",
    year: 2023,
    teamShort: "T1",
    teamFull: "T1",
    teamColor: "#E4002B",
    region: "LCK",
    nationality: "South Korea",
    iso: "kr",
    isWinner: true,
    championshipLeague: "WORLDS",
    championshipYear: 2023,
  },
  {
    id: "faker_2024",
    name: "Faker",
    realName: "이상혁",
    position: "MID",
    year: 2024,
    teamShort: "T1",
    teamFull: "T1",
    teamColor: "#E4002B",
    region: "LCK",
    nationality: "South Korea",
    iso: "kr",
    isWinner: true,
    championshipLeague: "WORLDS",
    championshipYear: 2024,
  },
];

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

// 랜덤 페이커 선택 함수
function getRandomFaker(excludeIds: string[] = []): Player {
  const availableFakers = FAKER_PLAYERS.filter(
    (f) => !excludeIds.includes(f.id),
  );
  const randomIndex = Math.floor(Math.random() * availableFakers.length);
  return availableFakers[randomIndex];
}

export default function TestFakerPage() {
  const { language, t, showWorldsAnimation, setShowWorldsAnimation } =
    useLanguage();
  const [roster, setRoster] = useState<UserRoster>({
    id: "",
    createdAt: Date.now(),
  });

  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isMultiGachaOpen, setIsMultiGachaOpen] = useState(false);
  const [multiPlayers, setMultiPlayers] = useState<Map<Position, Player>>(
    new Map(),
  );

  const handleSummon = (position: Position) => {
    setSelectedPosition(position);

    // Get excluded player IDs (already in roster)
    const excludeIds = POSITIONS.map(
      (pos) =>
        roster[pos.toLowerCase() as keyof UserRoster] as Player | undefined,
    )
      .filter((p): p is Player => p !== undefined)
      .map((p) => p.id);

    // Get player - 미드면 페이커, 아니면 랜덤
    let player: Player;
    if (position === "MID") {
      player = getRandomFaker(excludeIds);
    } else {
      player = getRandomPlayer(position, excludeIds);
    }

    setCurrentPlayer(player);
    setIsGachaOpen(true);
  };

  const handleConfirm = () => {
    if (currentPlayer && selectedPosition) {
      setRoster((prev) => ({
        ...prev,
        [selectedPosition.toLowerCase()]: currentPlayer,
      }));
    }
    setIsGachaOpen(false);
    setCurrentPlayer(null);
    setSelectedPosition(null);
  };

  const handleCancel = () => {
    // Reroll - get another player
    if (selectedPosition) {
      const excludeIds = POSITIONS.map(
        (pos) =>
          roster[pos.toLowerCase() as keyof UserRoster] as Player | undefined,
      )
        .filter((p): p is Player => p !== undefined)
        .map((p) => p.id);

      // 미드면 다른 페이커, 아니면 랜덤
      let player: Player;
      if (selectedPosition === "MID") {
        player = getRandomFaker(excludeIds);
      } else {
        player = getRandomPlayer(selectedPosition, excludeIds);
      }

      setCurrentPlayer(player);
    }
  };

  const handleReset = () => {
    setRoster({
      id: "",
      createdAt: Date.now(),
    });
  };

  const handleSummonAll = () => {
    // 빈 포지션들 찾기
    const emptyPositions = POSITIONS.filter(
      (pos) => !roster[pos.toLowerCase() as keyof UserRoster],
    );

    if (emptyPositions.length === 0) return;

    // Get excluded player IDs
    const excludeIds = POSITIONS.map(
      (pos) =>
        roster[pos.toLowerCase() as keyof UserRoster] as Player | undefined,
    )
      .filter((p): p is Player => p !== undefined)
      .map((p) => p.id);

    // Get all players at once
    const newPlayers = new Map<Position, Player>();
    const usedIds = new Set(excludeIds);

    emptyPositions.forEach((position) => {
      let player: Player;
      if (position === "MID") {
        player = getRandomFaker(Array.from(usedIds));
      } else {
        player = getRandomPlayer(position, Array.from(usedIds));
      }
      newPlayers.set(position, player);
      usedIds.add(player.id);
    });

    setMultiPlayers(newPlayers);
    setIsMultiGachaOpen(true);
  };

  const handleMultiConfirm = () => {
    // Add all players to roster
    const updates: Partial<UserRoster> = {};
    multiPlayers.forEach((player, position) => {
      (updates as any)[position.toLowerCase()] = player;
    });

    setRoster((prev) => ({ ...prev, ...updates }));
    setIsMultiGachaOpen(false);
    setMultiPlayers(new Map());
  };

  const handleMultiReroll = () => {
    // Reroll all positions
    const positions = Array.from(multiPlayers.keys());
    const excludeIds = POSITIONS.map(
      (pos) =>
        roster[pos.toLowerCase() as keyof UserRoster] as Player | undefined,
    )
      .filter((p): p is Player => p !== undefined)
      .map((p) => p.id);

    const newPlayers = new Map<Position, Player>();
    const usedIds = new Set(excludeIds);

    positions.forEach((position) => {
      let player: Player;
      if (position === "MID") {
        player = getRandomFaker(Array.from(usedIds));
      } else {
        player = getRandomPlayer(position, Array.from(usedIds));
      }
      newPlayers.set(position, player);
      usedIds.add(player.id);
    });

    setMultiPlayers(newPlayers);
  };

  const isRosterComplete = POSITIONS.every(
    (pos) => roster[pos.toLowerCase() as keyof UserRoster],
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="h-auto hextech-bg hexagon-pattern mb-20 md:mb-0">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Title Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              🎮 Faker Test Mode
            </h1>
            <p className="text-lol-light text-lg max-w-2xl mx-auto mb-2">
              {t("mainDescription")}
            </p>
            <p className="text-lol-gold text-sm font-bold">
              ⚠️ 테스트 모드: 미드 포지션에서 페이커만 등장합니다
            </p>

            {/* Worlds Animation Toggle */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center gap-3 cursor-pointer bg-lol-dark-lighter/50 px-4 py-3 rounded-lg border border-lol-gold/30 hover:border-lol-gold/60 transition-all">
                <div className="flex flex-col items-start">
                  <span className="text-white font-bold text-sm">
                    {t("worldsAnimation")}
                  </span>
                  <span className="text-lol-light text-xs">
                    {t("worldsAnimationDesc")}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showWorldsAnimation}
                    onChange={(e) => setShowWorldsAnimation(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-lol-gold transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>
            </motion.div>

            {isRosterComplete && (
              <motion.button
                onClick={handleReset}
                className="mt-4 px-6 py-2 rounded-lg bg-red-600/80 border border-red-500/50 text-white hover:bg-red-500 hover:border-red-400 transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                Reset Roster
              </motion.button>
            )}
          </motion.div>

          {/* Roster Grid Section */}
          <section aria-label="Player Roster" className="py-6">
            <h2 className="sr-only">League of Legends Player Roster</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 px-4">
              {POSITIONS.map((position, index) => (
                <motion.div
                  key={position}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="overflow-visible"
                >
                  <PlayerCard
                    player={
                      (roster[
                        position.toLowerCase() as keyof UserRoster
                      ] as Player) || null
                    }
                    position={position}
                    onClick={() => handleSummon(position)}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Summon Actions Section */}
          {!isRosterComplete && (
            <section aria-label="Summon Actions" className="pb-8">
              <h2 className="sr-only">Summon Players</h2>
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => {
                    // Find first empty position
                    const emptyPosition = POSITIONS.find(
                      (pos) => !roster[pos.toLowerCase() as keyof UserRoster],
                    );
                    if (emptyPosition) {
                      handleSummon(emptyPosition);
                    }
                  }}
                  className="px-8 py-3 rounded-lg font-bold text-lg text-white bg-lol-blue hover:bg-lol-blue-dark transition-all transform hover:scale-105"
                >
                  <img
                    src="/select.svg"
                    alt="Summon single player"
                    className="inline h-6 w-6 mr-2"
                  />{" "}
                  {t("selectOne")}
                </button>

                <button
                  onClick={handleSummonAll}
                  className="px-12 py-4 rounded-lg font-bold text-xl text-black bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold transition-all gold-glow transform hover:scale-105"
                >
                  <img
                    src="/select.svg"
                    alt="Summon all players"
                    className="inline h-6 w-6 mr-2"
                  />
                  {t("selectAll")}
                </button>
              </motion.div>
            </section>
          )}

          {/* Info Section */}
          {isRosterComplete && (
            <motion.div
              className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span>
                로스터 완성!
              </h3>
              <p className="text-lol-light mb-4">
                미드 포지션에 페이커가 포함된 로스터를 완성했습니다.
              </p>
              <div className="flex gap-4">
                <a
                  href="/"
                  className="flex-1 text-center px-6 py-3 rounded-lg font-bold text-white bg-lol-grey hover:bg-lol-grey/80 transition-colors"
                >
                  ← 메인 페이지로
                </a>
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 rounded-lg font-bold text-white bg-red-600/80 hover:bg-red-500 transition-colors"
                >
                  다시 시작
                </button>
              </div>
            </motion.div>
          )}

          {/* Back Link */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href="/"
              className="text-lol-gold hover:text-lol-gold-dark transition-colors"
            >
              ← 메인 페이지로 돌아가기
            </a>
          </motion.div>
        </main>

        {/* Gacha Modal */}
        <GachaModal
          player={currentPlayer}
          isOpen={isGachaOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

        {/* Multi Gacha Modal */}
        <GachaMultiModal
          players={multiPlayers}
          isOpen={isMultiGachaOpen}
          onConfirm={handleMultiConfirm}
          onReroll={handleMultiReroll}
        />
      </div>
    </LazyMotion>
  );
}
