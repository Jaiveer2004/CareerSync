"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onLoadingComplete?: () => void;
}

export function Loader({ onLoadingComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

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
        className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center font-mono"
      >
        <div className="w-64">
          <div className="flex justify-between items-end mb-4 text-slate-400 text-sm">
            <span className="font-serif">CareerSync.System</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-none overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="mt-6 text-xs text-slate-500 flex justify-center space-x-2">
            <span className="animate-pulse text-indigo-400">Loading algorithms</span>
            <span>...</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
