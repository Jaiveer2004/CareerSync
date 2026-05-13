"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onLoadingComplete?: () => void;
}

export function Loader({ onLoadingComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  const statusText =
    progress < 35
      ? "Preparing your workspace"
      : progress < 70
      ? "Matching top opportunities"
      : "Finalizing recommendations";

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onLoadingComplete?.();
          }, 400);
          return 100;
        }
        return prev + 5; // Fast deterministic loading for feel
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-50"
      >
        <div className="pointer-events-none absolute -top-40 -left-24 h-72 w-72 rounded-full bg-sky-200/55 blur-3xl" />
        <motion.div
          className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-blue-200/60 blur-3xl"
          animate={{
            y: [0, -14, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative w-[min(92vw,30rem)] rounded-2xl border border-slate-200/70 bg-white/80 p-7 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] backdrop-blur-md"
          role="status"
          aria-live="polite"
          aria-label="CareerSync is loading"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-serif text-xl text-slate-900">CareerSync</p>
              <p className="mt-1 text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                Premium Job Intelligence
              </p>
            </div>
            <motion.div
              className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              {progress}%
            </motion.div>
          </div>

          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <motion.p
              key={statusText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="font-medium"
            >
              {statusText}
            </motion.p>
            <p className="text-xs tracking-[0.16em] text-slate-500 uppercase">Please wait</p>
          </div>

          <div className="mt-5 flex gap-2" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-blue-500"
                animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.18 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
