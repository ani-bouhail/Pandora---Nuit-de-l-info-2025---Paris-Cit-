"use client";

import { motion } from "framer-motion";
import { Cloud as CloudIcon } from "lucide-react";

interface CloudProps {
    id: number;
    onClick: (id: number) => void;
    isExploded: boolean;
    content: string | null;
}

export function Cloud({ id, onClick, isExploded, content }: CloudProps) {
    // Randomize animation duration and delay for natural feel
    const duration = 4 + Math.random() * 4;
    const delay = Math.random() * 2;

    return (
        <motion.div
            className="absolute cursor-pointer"
            initial={{ x: -100, opacity: 0 }}
            animate={{
                x: ["0%", "100%", "0%"],
                y: [0, -20, 0],
                opacity: 1
            }}
            transition={{
                x: { duration: 20 + Math.random() * 10, repeat: Infinity, ease: "linear" },
                y: { duration: duration, repeat: Infinity, ease: "easeInOut", delay: delay },
                opacity: { duration: 1 }
            }}
            style={{
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 60}%`,
            }}
            onClick={() => !isExploded && onClick(id)}
        >
            {isExploded ? (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    className="text-white font-bold text-xl"
                >
                    {content === "win" ? "BINGO!" : content === "win2" ? "ALLLLEZZZ!" : "POUF!"}
                </motion.div>
            ) : (
                <div className="relative group">
                    <CloudIcon
                        className="w-24 h-24 text-white/80 filter drop-shadow-lg group-hover:text-white transition-colors"
                        fill="currentColor"
                    />
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </motion.div>
    );
}
