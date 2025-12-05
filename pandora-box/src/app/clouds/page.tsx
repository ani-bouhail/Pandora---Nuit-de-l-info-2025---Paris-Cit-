"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";
import { Cloud } from "@/components/Cloud";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function CloudChallenge() {
    const router = useRouter();
    const { tokens, decrementTokens, unlockStage } = useGame();
    const [clouds, setClouds] = useState<{ id: number; isExploded: boolean; type: "win" | "win2" | "lose" }[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Initialize 13 clouds
        const newClouds: { id: number; isExploded: boolean; type: "win" | "win2" | "lose" }[] = Array.from({ length: 13 }, (_, i) => ({
            id: i,
            isExploded: false,
            type: "lose",
        }));

        // Randomly assign 2 winners
        let winnersAssigned = 0;
        while (winnersAssigned < 2) {
            const idx = Math.floor(Math.random() * 13);
            if (newClouds[idx].type === "lose") {
                newClouds[idx].type = winnersAssigned === 0 ? "win" : "win2";
                winnersAssigned++;
            }
        }
        setClouds(newClouds);
    }, []);

    const handleShoot = (id: number) => {
        if (tokens < 1) {
            setMessage("Pas assez de tokens ! Attendez ou réinitialisez.");
            return;
        }

        if (decrementTokens(1)) {
            setClouds((prev) =>
                prev.map((c) => (c.id === id ? { ...c, isExploded: true } : c))
            );

            const cloud = clouds.find((c) => c.id === id);
            if (cloud?.type === "win" || cloud?.type === "win2") {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
                setMessage(cloud.type === "win" ? "BINGO !" : "ALLLLEZZZ !");
                unlockStage(3);
                setTimeout(() => router.push("/riddle"), 2000);
            } else {
                setMessage("Raté ! Essayez encore.");
            }
        }
    };

    return (
        <main className="min-h-screen bg-myth-dark overflow-hidden flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col md:flex-row pt-20">
                {/* Left Side: Description */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center relative z-10">
                    <div className="bg-myth-purple/20 backdrop-blur-md p-8 rounded-3xl border border-myth-gold/20 shadow-myth-glow max-w-lg w-full">
                        <h2 className="text-3xl font-serif font-bold text-myth-gold mb-6">Le Défi des Nuages</h2>
                        <p className="text-myth-light/90 mb-6 leading-relaxed">
                            Devant vous flottent 13 nuages mystiques. Seuls deux d'entre eux dissimulent le chemin vers la Boîte de Pandore.
                            <br /><br />
                            Chaque tir vous coûtera <span className="text-myth-gold font-bold">1 Token</span>.
                            <br />
                            Choisissez sagement, ou laissez le hasard guider votre main.
                        </p>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-myth-accent/80 p-4 rounded-xl border border-myth-gold/50 text-center font-bold text-myth-gold"
                            >
                                {message}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Right Side: Game Area */}
                <div className="w-full md:w-1/2 relative bg-gradient-to-b from-sky-900/20 to-myth-dark/50 border-l border-white/5">
                    <div className="absolute inset-0 overflow-hidden">
                        {clouds.map((cloud) => (
                            <Cloud
                                key={cloud.id}
                                id={cloud.id}
                                isExploded={cloud.isExploded}
                                content={cloud.type}
                                onClick={handleShoot}
                            />
                        ))}
                    </div>

                    {/* Canon Control (Visual only, click is on clouds) */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
                        <div className="text-sm text-myth-light/60 mb-2">Cliquez sur un nuage pour tirer</div>
                        <Button disabled={tokens < 1} className="pointer-events-none opacity-80">
                            Canon Prêt (1 Token/Tir)
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
