"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import White from "./components/white";
import TravelingBlockSection from "./components/TravelingBlockSection";

export default function Home() {
  const [heroTransitionProgress, setHeroTransitionProgress] = useState(0);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const t = Math.max(0, Math.min(1, heroTransitionProgress));
  const compactT = Math.max(0, Math.min(1, t * 1.9));
  const navWordT = Math.max(0, Math.min(1, (t - 0.98) / 0.02));
  const navCtaT = Math.max(0, Math.min(1, (heroScrollProgress - 0.28) / 0.03));

  return (
    <main className="w-full">
      <header className="fixed inset-x-0 top-0 z-50">
        <motion.nav
          animate={{
            width: `clamp(288px, ${96 - compactT * 52}vw, 1100px)`,
            height: 46 - compactT * 8,
            marginTop: 12 - compactT * 4,
            paddingLeft: 14 - compactT * 4,
            paddingRight: 14 - compactT * 4,
            borderRadius: 9999,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.9 }}
          className="relative mx-auto flex items-center justify-between border border-black/10 bg-white/20 backdrop-blur-md max-sm:max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)]"
        >
          <div className="min-w-0 flex items-center gap-1.5">
            <Image
              src="/logo.png"
              alt="DeepMind logo"
              width={142}
              height={30}
              priority
              className="h-5 w-auto shrink-0 object-contain sm:h-6 md:h-7"
            />
            <motion.span
              style={{
                opacity: navWordT,
                x: (1 - navWordT) * -3,
                scale: 0.92 + navWordT * 0.08,
              }}
              className="truncate text-xs font-medium tracking-tight sm:text-sm md:text-base"
            >
              <motion.span
                className="inline-block bg-[length:200%_100%] text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  y: [0, -0.5, 0],
                  scale: [1, 1.01, 1],
                }}
                transition={{
                  backgroundPosition: {
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 3.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: 3.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #0b0b0c 0%, #4b5563 50%, #9ca3af 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 6px 18px rgba(17,17,17,0.16)",
                }}
              >
                DeepMind
              </motion.span>
            </motion.span>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/80"
          >
            <span className="relative block h-3.5 w-4">
              <span className="absolute left-0 top-0 h-[1.5px] w-4 bg-current" />
              <span className="absolute left-0 top-1.5 h-[1.5px] w-4 bg-current" />
              <span className="absolute left-0 top-3 h-[1.5px] w-4 bg-current" />
            </span>
          </button>

          <motion.button
            type="button"
            style={{
              opacity: navCtaT,
              scale: 0.96 + navCtaT * 0.04,
              y: (1 - navCtaT) * 2,
              pointerEvents: navCtaT > 0.95 ? "auto" : "none",
            }}
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 px-2 py-0.5 text-[11px] font-medium tracking-[0.03em] text-black/55 sm:inline-flex md:text-xs"
          >
            <motion.span
              animate={{ backgroundColor: ["#2563eb", "#f97316", "#2563eb"] }}
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full"
            />
            Sign up now
          </motion.button>
        </motion.nav>
      </header>

      <White
        onHeroTransitionProgressChange={setHeroTransitionProgress}
        onHeroScrollProgressChange={setHeroScrollProgress}
      />
      <TravelingBlockSection />
    </main>
  );
}
