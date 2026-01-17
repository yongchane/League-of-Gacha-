"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navigation() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      {/* Header */}
      {pathname !== "/community" && (
        <header className="border-b border-lol-gold/30 bg-lol-dark-accent/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
            <Link href="/">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              >
                <img
                  src="/log.png"
                  alt="LOL Logo"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-lol-gold">
                    League of Gacha
                  </h1>
                </div>
              </motion.div>
            </Link>
            <div className="flex gap-4">
              <div className="flex gap-1 bg-lol-dark-lighter rounded-lg p-1">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                    language === "en"
                      ? "bg-lol-gold text-black"
                      : "text-lol-light hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("ko")}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
                    language === "ko"
                      ? "bg-lol-gold text-black"
                      : "text-lol-light hover:text-white"
                  }`}
                >
                  KO
                </button>
              </div>
              {/* Desktop Navigation */}
              <div className="hidden md:flex gap-4 items-center">
                {/* Language Toggle */}

                <Link href="/my-page">
                  <button className="px-4 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold/60 transition-all">
                    {t("myPage")}
                  </button>
                </Link>
                <Link href="/community">
                  <button className="px-4 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold/60 transition-all">
                    {t("community")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}
      {/* Mobile Navigation Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-lol-dark-accent/95 backdrop-blur-md border-t border-lol-gold/30 z-40">
        <div className="flex items-center justify-around px-4 py-3">
          <Link href="/" className="flex-1">
            <button className="w-full px-3 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold/60 transition-all text-sm font-medium">
              {t("home")}
            </button>
          </Link>
          <Link href="/my-page" className="flex-1 mx-2">
            <button className="w-full px-3 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold/60 transition-all text-sm font-medium">
              {t("myPage")}
            </button>
          </Link>
          <Link href="/community" className="flex-1">
            <button className="w-full px-3 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold/60 transition-all text-sm font-medium">
              {t("community")}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
