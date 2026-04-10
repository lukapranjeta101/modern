"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";

const TOTAL_FRAMES = 151;
const SCROLL_LENGTH_VH = 200;
const SCRUB_PIXELS = 2200;
const TOUCH_SCRUB_MULTIPLIER = 1.35;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function frameId(index: number) {
  return String(index + 1).padStart(3, "0");
}

function loadFrame(index: number): Promise<HTMLImageElement> {
  const id = frameId(index);

  return new Promise((resolve, reject) => {
    const jpg = new Image();
    jpg.decoding = "async";
    jpg.loading = "eager";
    jpg.onload = () => resolve(jpg);
    jpg.onerror = () => reject(new Error(`Failed loading frame ${id}`));
    jpg.src = `/mycomponents/ezgif-frame-${id}.jpg`;
  });
}

function sampleBackgroundFromFrame(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "#f7f7f8";

  ctx.drawImage(img, 0, 0);
  const corners = [
    [0, 0],
    [canvas.width - 1, 0],
    [0, canvas.height - 1],
    [canvas.width - 1, canvas.height - 1],
  ] as const;

  let r = 0;
  let g = 0;
  let b = 0;

  corners.forEach(([x, y]) => {
    const px = ctx.getImageData(x, y, 1, 1).data;
    r += px[0];
    g += px[1];
    b += px[2];
  });

  r = Math.round(r / corners.length);
  g = Math.round(g / corners.length);
  b = Math.round(b / corners.length);

  const hex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

type WhiteProps = {
  onHeroTransitionProgressChange?: (progress: number) => void;
  onHeroScrollProgressChange?: (progress: number) => void;
};

export default function White({
  onHeroTransitionProgressChange,
  onHeroScrollProgressChange,
}: WhiteProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastFrameDrawnRef = useRef(-1);
  const lastTickRef = useRef(0);
  const bgColorRef = useRef("#f7f7f8");

  const [isLoaded, setIsLoaded] = useState(false);
  const [bgColor, setBgColor] = useState("#f7f7f8");
  const [isMobile, setIsMobile] = useState(false);
  const sequenceProgress = useMotionValue(0);

  const smoothProgress = useSpring(sequenceProgress, {
    stiffness: 130,
    damping: 34,
    mass: 0.24,
    restDelta: 0.0005,
  });

  const heroFlight = useSpring(smoothProgress, {
    stiffness: 95,
    damping: 28,
    mass: 0.42,
    restDelta: 0.0007,
  });

  const heroY = useTransform(heroFlight, [0, 0.025, 0.045], [0, -4, -10]);
  const heroScale = useTransform(heroFlight, [0, 0.025, 0.045], [1, 0.6, 0.06]);
  const heroOpacity = useTransform(
    heroFlight,
    [0, 0.035, 0.045],
    [1, 1, 0]
  );

  const f1Opacity = useTransform(smoothProgress, [0.08, 0.15, 0.28], [0, 1, 0]);
  const f1Y = useTransform(smoothProgress, [0.08, 0.28], [22, -16]);
  const f1HeadingColor = useTransform(
    smoothProgress,
    [0.08, 0.18, 0.28],
    ["rgba(17,17,17,0.3)", "rgba(17,17,17,0.9)", "rgba(17,17,17,0.4)"]
  );
  const f1BodyColor = useTransform(
    smoothProgress,
    [0.08, 0.18, 0.28],
    ["rgba(17,17,17,0.35)", "rgba(17,17,17,0.72)", "rgba(17,17,17,0.45)"]
  );

  const f2Opacity = useTransform(smoothProgress, [0.4, 0.48, 0.6], [0, 1, 0]);
  const f2Y = useTransform(smoothProgress, [0.4, 0.6], [22, -16]);
  const f2HeadingColor = useTransform(
    smoothProgress,
    [0.4, 0.5, 0.6],
    ["rgba(17,17,17,0.3)", "rgba(17,17,17,0.9)", "rgba(17,17,17,0.4)"]
  );
  const f2BodyColor = useTransform(
    smoothProgress,
    [0.4, 0.5, 0.6],
    ["rgba(17,17,17,0.35)", "rgba(17,17,17,0.72)", "rgba(17,17,17,0.45)"]
  );

  const f3Opacity = useTransform(smoothProgress, [0.6, 0.68, 0.8], [0, 1, 0]);
  const f3Y = useTransform(smoothProgress, [0.6, 0.8], [22, -16]);
  const f3HeadingColor = useTransform(
    smoothProgress,
    [0.6, 0.7, 0.8],
    ["rgba(17,17,17,0.3)", "rgba(17,17,17,0.9)", "rgba(17,17,17,0.4)"]
  );
  const f3BodyColor = useTransform(
    smoothProgress,
    [0.6, 0.7, 0.8],
    ["rgba(17,17,17,0.35)", "rgba(17,17,17,0.72)", "rgba(17,17,17,0.45)"]
  );

  const ctaOpacity = useTransform(smoothProgress, [0.8, 0.88, 1], [0, 1, 1]);
  const ctaY = useTransform(smoothProgress, [0.8, 1], [18, 0]);
  const ctaHeadingColor = useTransform(
    smoothProgress,
    [0.8, 0.9, 1],
    ["rgba(17,17,17,0.3)", "rgba(17,17,17,0.9)", "rgba(17,17,17,0.9)"]
  );
  const ctaBodyColor = useTransform(
    smoothProgress,
    [0.8, 0.9, 1],
    ["rgba(17,17,17,0.35)", "rgba(17,17,17,0.72)", "rgba(17,17,17,0.72)"]
  );
  const heroGradient = useMotionTemplate`linear-gradient(180deg, rgba(247,247,248,0) 0%, rgba(247,247,248,${isMobile ? 0.94 : 0.76}) 55%, rgba(247,247,248,0.98) 100%)`;

  const getSectionScrollBounds = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return null;

    const top = section.getBoundingClientRect().top + window.scrollY;
    const bottom = top + section.offsetHeight - window.innerHeight;

    return {
      top,
      bottom: Math.max(top, bottom),
    };
  }, []);

  const drawFrame = useCallback((frameProgress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const nextW = Math.floor(vw * dpr);
    const nextH = Math.floor(vh * dpr);

    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
    }

    canvas.style.width = `${vw}px`;
    canvas.style.height = `${vh}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    ctx.fillStyle = bgColorRef.current;
    ctx.fillRect(0, 0, vw, vh);

    const clamped = Math.min(TOTAL_FRAMES - 1, Math.max(0, frameProgress));
    const baseIndex = Math.floor(clamped);
    const nextIndex = Math.min(baseIndex + 1, TOTAL_FRAMES - 1);
    const mix = clamped - baseIndex;

    const base = framesRef.current[baseIndex];
    const next = framesRef.current[nextIndex];
    if (!base || !next) return;

    const imgRatio = base.naturalWidth / base.naturalHeight;
    const viewRatio = vw / vh;

    let drawW = vw;
    let drawH = vh;

    if (imgRatio > viewRatio) {
      drawH = vh;
      drawW = drawH * imgRatio;
    } else {
      drawW = vw;
      drawH = drawW / imgRatio;
    }

    const x = (vw - drawW) / 2;
    const y = (vh - drawH) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.globalAlpha = 1;
    ctx.drawImage(base, x, y, drawW, drawH);

    if (mix > 0 && nextIndex !== baseIndex) {
      ctx.globalAlpha = mix;
      ctx.drawImage(next, x, y, drawW, drawH);
      ctx.globalAlpha = 1;
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function preload() {
      const images = await Promise.all(
        Array.from({ length: TOTAL_FRAMES }, (_, i) => loadFrame(i))
      );
      if (cancelled) return;

      framesRef.current = images;
      const sampled = sampleBackgroundFromFrame(images[0]);
      bgColorRef.current = sampled;
      setBgColor(sampled);
      setIsLoaded(true);

      targetFrameRef.current = 0;
      currentFrameRef.current = 0;
      lastFrameDrawnRef.current = -1;
      drawFrame(0);
    }

    preload().catch(() => setIsLoaded(false));

    return () => {
      cancelled = true;
      isAnimatingRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  useEffect(() => {
    if (!isLoaded) return;

    const animate = () => {
      const now = performance.now();
      const dt = Math.min(64, now - (lastTickRef.current || now));
      lastTickRef.current = now;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const delta = target - current;
      const blend = 1 - Math.exp(-dt / 72);

      currentFrameRef.current =
        Math.abs(delta) < 0.0008 ? target : current + delta * blend;

      const progressFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, currentFrameRef.current)
      );

      if (Math.abs(progressFrame - lastFrameDrawnRef.current) > 0.001) {
        drawFrame(progressFrame);
        lastFrameDrawnRef.current = progressFrame;
      }

      if (
        Math.abs(targetFrameRef.current - currentFrameRef.current) > 0.01 ||
        Math.abs(progressFrame - targetFrameRef.current) > 0.01
      ) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
        rafRef.current = null;
      }
    };

    const start = () => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      lastTickRef.current = performance.now();
      rafRef.current = requestAnimationFrame(animate);
    };

    const unsub = sequenceProgress.on("change", (latest) => {
      targetFrameRef.current = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, latest * (TOTAL_FRAMES - 1))
      );
      start();
    });

    return () => {
      unsub();
      isAnimatingRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [drawFrame, isLoaded, sequenceProgress]);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const normalized = Math.min(1, Math.max(0, latest / 0.045));
    onHeroTransitionProgressChange?.(normalized);
    onHeroScrollProgressChange?.(latest);
  });

  useEffect(() => {
    if (!isLoaded) return;

    let lastTouchY = 0;

    const scrubWindowScroll = (deltaY: number) => {
      const bounds = getSectionScrollBounds();
      if (!bounds) return false;

      const current = window.scrollY;
      const withinSection = current >= bounds.top && current <= bounds.bottom;
      const progress = sequenceProgress.get();

      if (!withinSection) {
        return false;
      }

      if (deltaY > 0 && progress < 1) {
        window.scrollTo({ top: bounds.top, behavior: "auto" });
        sequenceProgress.set(clamp(progress + deltaY / SCRUB_PIXELS, 0, 1));
        return true;
      }

      if (deltaY < 0 && progress > 0) {
        window.scrollTo({ top: bounds.bottom, behavior: "auto" });
        sequenceProgress.set(clamp(progress + deltaY / SCRUB_PIXELS, 0, 1));
        return true;
      }

      if (deltaY > 0 && progress >= 1 && current < bounds.bottom - 1) {
        window.scrollTo({ top: bounds.bottom, behavior: "auto" });
        return true;
      }

      if (deltaY < 0 && progress <= 0 && current > bounds.top + 1) {
        window.scrollTo({ top: bounds.top, behavior: "auto" });
        return true;
      }

      return false;
    };

    const handleWheel = (event: WheelEvent) => {
      if (scrubWindowScroll(event.deltaY)) {
        event.preventDefault();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentTouchY = event.touches[0]?.clientY;
      if (currentTouchY == null) return;

      const deltaY = lastTouchY - currentTouchY;
      lastTouchY = currentTouchY;

      if (scrubWindowScroll(deltaY * TOUCH_SCRUB_MULTIPLIER)) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [getSectionScrollBounds, isLoaded, sequenceProgress]);

  useEffect(() => {
    if (!isLoaded) return;

    const onResize = () => {
      const progress = sequenceProgress.get();
      const frame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, progress * (TOTAL_FRAMES - 1))
      );
      targetFrameRef.current = frame;
      currentFrameRef.current = frame;
      lastFrameDrawnRef.current = frame;
      drawFrame(frame);
    };

    window.addEventListener("resize", onResize, { passive: true });
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [drawFrame, isLoaded, sequenceProgress]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-x-hidden overscroll-y-contain"
      style={{ backgroundColor: bgColor, height: `${SCROLL_LENGTH_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="block h-screen w-full" />

        {!isLoaded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/15 border-t-black/45" />
              <p className="text-sm tracking-[0.12em] text-black/40">LOADING DEEPMIND</p>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-20">
          <motion.div
            style={{ opacity: heroOpacity, background: heroGradient }}
            className="absolute inset-x-0 bottom-0 h-1/2 md:hidden"
          />
          <motion.div
            style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
            className="absolute inset-0 flex items-center justify-center px-5 pb-14 pt-20 text-center sm:px-6 md:px-10"
          >
            <div className="max-w-5xl">
              <h1 className="text-[clamp(3.25rem,19vw,6rem)] font-medium tracking-tight md:text-8xl lg:text-9xl">
                <motion.span
                  className="inline-block bg-[length:200%_100%] text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    y: [0, -1, 0],
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
                    textShadow: "0 8px 24px rgba(17,17,17,0.18)",
                  }}
                >
                  DeepMind
                </motion.span>
              </h1>
              <button
                type="button"
                className="mt-5 inline-flex items-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium tracking-[0.02em] text-white transition-colors hover:bg-blue-700"
              >
                Sign up now
              </button>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: f1Opacity, y: f1Y }}
            className="absolute inset-0 flex items-end justify-center px-5 pb-16 pt-24 sm:px-8 md:items-center md:justify-start md:px-16"
          >
            <div className="w-full max-w-md rounded-[1.75rem] bg-white/72 p-5 text-left shadow-[0_18px_40px_rgba(17,17,17,0.08)] backdrop-blur-sm md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0">
              <p className="mb-3 text-xs uppercase tracking-[0.16em] text-black/40">
                Understanding
              </p>
              <motion.h2
                style={{ color: f1HeadingColor }}
                className="text-left text-3xl font-medium tracking-tight md:text-5xl"
              >
                AI that learns how the world works.
              </motion.h2>
              <motion.p
                style={{ color: f1BodyColor }}
                className="mt-5 text-left text-base leading-relaxed"
              >
                We train models that understand patterns across data,
                environments, and human behavior — enabling systems that adapt,
                not just respond.
              </motion.p>
              <button
                type="button"
                className="mt-6 inline-flex items-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium tracking-[0.02em] text-white transition-colors hover:bg-blue-700"
              >
                Sign up now
              </button>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: f2Opacity, y: f2Y }}
            className="absolute inset-0 flex items-end justify-center px-5 pb-16 pt-24 sm:px-8 md:items-center md:justify-end md:px-16"
          >
            <div className="w-full max-w-md rounded-[1.75rem] bg-white/72 p-5 text-left shadow-[0_18px_40px_rgba(17,17,17,0.08)] backdrop-blur-sm md:rounded-none md:bg-transparent md:p-0 md:text-right md:shadow-none md:backdrop-blur-0">
              <p className="mb-3 text-xs uppercase tracking-[0.16em] text-black/40">
                Reasoning
              </p>
              <motion.h2
                style={{ color: f2HeadingColor }}
                className="text-3xl font-medium tracking-tight md:text-5xl"
              >
                From prediction to decision-making.
              </motion.h2>
              <motion.p style={{ color: f2BodyColor }} className="mt-5 text-base leading-relaxed">
                Our systems go beyond outputs — they evaluate, plan, and make
                informed decisions in dynamic, real-world scenarios.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: f3Opacity, y: f3Y }}
            className="absolute inset-0 flex items-end justify-center px-5 pb-16 pt-24 sm:px-8 md:items-center md:justify-start md:px-16"
          >
            <div className="w-full max-w-md rounded-[1.75rem] bg-white/72 p-5 text-left shadow-[0_18px_40px_rgba(17,17,17,0.08)] backdrop-blur-sm md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0">
              <p className="mb-3 text-xs uppercase tracking-[0.16em] text-black/40">
                Impact
              </p>
              <motion.h2
                style={{ color: f3HeadingColor }}
                className="text-left text-3xl font-medium tracking-tight md:text-5xl"
              >
                Research, translated into reality.
              </motion.h2>
              <motion.p
                style={{ color: f3BodyColor }}
                className="mt-5 text-left text-base leading-relaxed"
              >
                From healthcare to energy to infrastructure, we apply AI where
                it matters most — solving problems at scale.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="absolute inset-0 flex items-end justify-center px-5 pb-16 pt-24 text-center sm:px-6 md:items-center md:px-8"
          >
            <div className="w-full max-w-4xl rounded-[1.75rem] bg-white/78 p-6 shadow-[0_18px_44px_rgba(17,17,17,0.08)] backdrop-blur-sm md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0">
              <p className="mb-3 text-xs uppercase tracking-[0.16em] text-black/40">
                Call to Action
              </p>
              <motion.h2
                style={{ color: ctaHeadingColor }}
                className="text-[2.2rem] font-medium tracking-tight md:text-6xl"
              >
                Shaping the future of intelligence.
              </motion.h2>
              <motion.p
                style={{ color: ctaBodyColor }}
                className="mx-auto mt-5 max-w-3xl text-base leading-relaxed md:mt-6 md:text-lg"
              >
                Join us in building systems that expand what&apos;s possible —
                for people, industries, and the world.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
