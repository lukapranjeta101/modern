"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type StoryItem = {
  label: string;
  headline: string;
  body: string;
  side: "left" | "right";
};

const STORY: StoryItem[] = [
  {
    label: "Understanding",
    side: "left",
    headline: "AI that learns how the world works.",
    body: "We build systems that recognize patterns across data, environments, and behavior — forming the foundation for adaptable intelligence.",
  },
  {
    label: "Reasoning",
    side: "right",
    headline: "From understanding to reasoning.",
    body: "Our models move beyond recognition alone, evaluating information, planning responses, and making decisions in dynamic conditions.",
  },
  {
    label: "Impact",
    side: "left",
    headline: "Research, translated into reality.",
    body: "From science to infrastructure, we apply advanced AI to real-world problems where intelligence can create measurable impact.",
  },
  {
    label: "Vision",
    side: "right",
    headline: "Shaping the future of intelligence.",
    body: "We are building the next generation of AI systems — designed to expand what is possible for people, industries, and the world.",
  },
];

export default function TravelingBlockSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const firstSectionRef = useRef<HTMLElement | null>(null);
  const impactSectionRef = useRef<HTMLElement | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 34,
    mass: 0.28,
    restDelta: 0.0006,
  });
  const { scrollYProgress: firstSectionScroll } = useScroll({
    target: firstSectionRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: impactSectionScroll } = useScroll({
    target: impactSectionRef,
    offset: ["start end", "end start"],
  });
  const firstSectionProgress = useSpring(firstSectionScroll, {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
    restDelta: 0.001,
  });
  const impactSectionProgress = useSpring(impactSectionScroll, {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
    restDelta: 0.001,
  });

  const blockX = useTransform(
    firstSectionProgress,
    [0, 0.16, 1],
    isMobile ? ["0vw", "0vw", "0vw"] : ["0vw", "24vw", "24vw"]
  );

  const blockRotate = useTransform(
    firstSectionProgress,
    [0, 0.16, 1],
    isMobile ? [0, 0, 0] : [0, 0.55, 0.55]
  );

  const blockScale = useTransform(
    firstSectionProgress,
    [0, 0.16, 1],
    isMobile ? [0.82, 0.88, 0.88] : [1, 1.03, 1.03]
  );

  const blockY = useTransform(
    firstSectionProgress,
    [0, 0.16, 1],
    isMobile ? ["-30vh", "-34vh", "-34vh"] : ["0vh", "-1vh", "-1vh"]
  );
  const globeX = useTransform(
    impactSectionProgress,
    [0, 0.16, 1],
    isMobile ? ["0vw", "0vw", "0vw"] : ["0vw", "22vw", "22vw"]
  );
  const globeY = useTransform(
    impactSectionProgress,
    [0, 0.16, 1],
    isMobile ? ["-28vh", "-32vh", "-32vh"] : ["0vh", "-1vh", "-1vh"]
  );

  const sectionBg = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "#ffffff",
      "#040405",
      "#ffffff",
      "#040405",
      "#040405",
    ]
  );

  const darkWashOpacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 0.5, 0, 0.52, 0.52]
  );

  const lightBloomOpacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0.3, 0.06, 0.28, 0.06, 0.04]
  );
  const cityBuildProgress = useSpring(
    useTransform(smoothProgress, [0.72, 1], [0, 1]),
    {
      stiffness: 90,
      damping: 24,
      mass: 0.6,
    }
  );
  const cityOpacity = useTransform(cityBuildProgress, [0, 0.25, 1], [0, 0.45, 1]);
  const cityBaseY = useTransform(cityBuildProgress, [0, 1], ["6vh", "0vh"]);
  const b1ScaleY = useTransform(cityBuildProgress, [0, 1], [0.08, 1]);
  const b2ScaleY = useTransform(cityBuildProgress, [0, 1], [0.08, 0.72]);
  const b3ScaleY = useTransform(cityBuildProgress, [0, 1], [0.08, 1.2]);
  const b4ScaleY = useTransform(cityBuildProgress, [0, 1], [0.08, 0.86]);
  const b5ScaleY = useTransform(cityBuildProgress, [0, 1], [0.08, 1.05]);
  const b6ScaleY = useTransform(cityBuildProgress, [0, 1], [0.08, 0.64]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ backgroundColor: sectionBg }}
      className="relative w-full"
      aria-label="Traveling Block Story Section"
    >
      <motion.div
        style={{ opacity: darkWashOpacity }}
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(120%_80%_at_50%_45%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_100%)]"
      />
      <motion.div
        style={{ opacity: lightBloomOpacity }}
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(90%_60%_at_50%_50%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_78%)]"
      />

      <div className="relative z-20">
        {STORY.map((item, index) => {
          const sectionAlign =
            item.side === "left"
              ? "items-start text-left"
              : "items-end text-right";
          const isImpactSection = index === 2;
          const isVisionSection = index === 3;
          const isFirstSection = index === 0;

          return (
            <section
              key={item.headline}
              ref={isFirstSection ? firstSectionRef : isImpactSection ? impactSectionRef : undefined}
              className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-14 md:py-24 lg:px-20"
            >
              {isFirstSection && (
                <motion.div
                  whileHover={canHover ? { scale: 1.08 } : undefined}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.div style={{ x: blockX, y: blockY, rotate: blockRotate, scale: blockScale }}>
                    <Image
                      src="/images/block.png"
                      alt="DeepMind block"
                      width={760}
                      height={760}
                      priority={false}
                      className="h-auto max-h-[34vh] w-auto max-w-[78vw] object-contain select-none sm:max-h-[40vh] sm:max-w-[58vw] md:max-h-[62vh] md:max-w-none"
                    />
                  </motion.div>
                </motion.div>
              )}

              {isImpactSection && (
                <motion.div
                  style={{ x: globeX, y: globeY }}
                  className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 34, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="relative h-32 w-32 [perspective:1000px] sm:h-40 sm:w-40 md:h-56 md:w-56 lg:h-64 lg:w-64"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Image
                      src="/images/earth-3d.svg"
                      alt="3D Earth"
                      width={1024}
                      height={1024}
                      className="h-full w-full rounded-full object-contain drop-shadow-[0_28px_46px_rgba(31,82,177,0.35)]"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="pointer-events-none absolute -inset-4 rounded-full border border-sky-200/55 [transform:rotateX(68deg)]"
                    />
                  </motion.div>
                </motion.div>
              )}
              {isVisionSection && (
                <motion.div
                  style={{ opacity: cityOpacity, y: cityBaseY }}
                  className="pointer-events-none absolute left-12 top-1/2 z-10 hidden h-64 w-[32rem] -translate-y-1/2 md:block lg:left-20"
                >
                  <div className="absolute inset-x-0 bottom-0 h-px bg-white/65" />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/25 to-transparent" />

                  <div className="absolute inset-0 flex items-end gap-2">
                    <motion.div style={{ scaleY: b1ScaleY }} className="relative h-36 w-10 origin-bottom rounded-t-sm bg-slate-100/80">
                      <div className="absolute inset-x-[22%] top-3 h-[2px] bg-slate-700/25" />
                      <div className="absolute inset-x-[22%] top-8 h-[2px] bg-slate-700/20" />
                      <div className="absolute inset-x-[22%] top-13 h-[2px] bg-slate-700/20" />
                    </motion.div>

                    <motion.div style={{ scaleY: b2ScaleY }} className="relative h-44 w-12 origin-bottom rounded-t-sm bg-slate-200/85 shadow-[0_0_14px_rgba(255,255,255,0.16)]">
                      <div className="absolute inset-x-[24%] top-3 h-[2px] bg-slate-800/22" />
                      <div className="absolute inset-x-[24%] top-8 h-[2px] bg-slate-800/22" />
                      <div className="absolute inset-x-[24%] top-13 h-[2px] bg-slate-800/18" />
                      <div className="absolute inset-x-[24%] top-18 h-[2px] bg-slate-800/18" />
                    </motion.div>

                    <motion.div style={{ scaleY: b3ScaleY }} className="relative h-56 w-16 origin-bottom rounded-t-md bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.24)]">
                      <div className="absolute left-1/2 top-[-22px] h-6 w-[2px] -translate-x-1/2 bg-white/80" />
                      <div className="absolute inset-x-[20%] top-4 h-[2px] bg-slate-900/20" />
                      <div className="absolute inset-x-[20%] top-9 h-[2px] bg-slate-900/20" />
                      <div className="absolute inset-x-[20%] top-14 h-[2px] bg-slate-900/18" />
                      <div className="absolute inset-x-[20%] top-19 h-[2px] bg-slate-900/18" />
                      <div className="absolute inset-x-[20%] top-24 h-[2px] bg-slate-900/16" />
                    </motion.div>

                    <motion.div style={{ scaleY: b4ScaleY }} className="relative h-40 w-11 origin-bottom rounded-t-sm bg-slate-100/80">
                      <div className="absolute inset-x-[24%] top-3 h-[2px] bg-slate-800/20" />
                      <div className="absolute inset-x-[24%] top-8 h-[2px] bg-slate-800/18" />
                      <div className="absolute inset-x-[24%] top-13 h-[2px] bg-slate-800/18" />
                    </motion.div>

                    <motion.div style={{ scaleY: b5ScaleY }} className="relative h-52 w-14 origin-bottom rounded-t-md bg-slate-50/85 shadow-[0_0_18px_rgba(255,255,255,0.2)]">
                      <div className="absolute inset-x-[22%] top-4 h-[2px] bg-slate-900/20" />
                      <div className="absolute inset-x-[22%] top-9 h-[2px] bg-slate-900/20" />
                      <div className="absolute inset-x-[22%] top-14 h-[2px] bg-slate-900/18" />
                      <div className="absolute inset-x-[22%] top-19 h-[2px] bg-slate-900/16" />
                    </motion.div>

                    <motion.div style={{ scaleY: b6ScaleY }} className="relative h-32 w-10 origin-bottom rounded-t-sm bg-slate-200/80">
                      <div className="absolute inset-x-[24%] top-3 h-[2px] bg-slate-800/20" />
                      <div className="absolute inset-x-[24%] top-8 h-[2px] bg-slate-800/18" />
                    </motion.div>

                    <motion.div
                      style={{ scaleY: cityBuildProgress }}
                      className="relative ml-1 h-20 w-20 origin-bottom"
                    >
                      <div className="absolute bottom-0 left-0 h-1 w-20 bg-white/55" />
                      <div className="absolute bottom-1 left-9 h-14 w-[2px] bg-white/70" />
                      <div className="absolute bottom-13 left-9 h-[2px] w-10 bg-white/70" />
                      <div className="absolute bottom-13 left-[4.6rem] h-7 w-[2px] bg-white/70" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              <div
                className={`relative z-20 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl flex-col justify-end pt-[36vh] ${sectionAlign} sm:pt-[42vh] md:min-h-[calc(100vh-12rem)] md:justify-center md:pt-0`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.45 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="w-full max-w-xl rounded-[1.75rem] border border-black/10 bg-white/82 p-6 shadow-[0_16px_40px_rgba(17,17,17,0.08)] backdrop-blur-md sm:p-7 md:p-10"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-[1px] w-9 bg-black/25" />
                    <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                      {item.label}
                    </p>
                  </div>
                  <h2 className="text-[2rem] font-medium leading-[1.06] tracking-tight text-black/90 sm:text-[2.5rem] md:text-6xl">
                    {item.headline}
                  </h2>
                  <p className="mt-5 text-[0.98rem] leading-relaxed text-black/60 md:mt-6 md:text-lg">
                    {item.body}
                  </p>
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>
    </motion.section>
  );
}
