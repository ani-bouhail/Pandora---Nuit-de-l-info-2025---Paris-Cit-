"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";
import { SnakeGame } from "@/components/SnakeGame";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function SnakePage() {
    const router = useRouter();
    const { gender } = useGame();
    const [gameWon, setGameWon] = useState(false);

    const handleWin = () => {
        setGameWon(true);
        confetti({
            particleCount: 500,
            spread: 100,
            origin: { y: 0.6 },
            colors: ["#ffd700", "#302b63", "#ffffff"]
        });
    };

    const handleFinalOpen = () => {
        // Final explosion
        const end = Date.now() + 2000;
        const colors = ["#ffd700", "#ffffff"];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            } else {
                // Reset or just show final message
                alert("Félicitations ! Vous avez terminé l'aventure !");
                router.push("/");
            }
        }());
    };

    return (
        <main className="min-h-screen bg-myth-dark pb-20">
            <Navbar />

            <div className="pt-24 px-4 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-serif font-bold text-myth-gold mb-4 text-shadow">
                        Le Serpent Légendaire
                    </h1>
                    <p className="text-myth-light/80 max-w-xl mx-auto">
                        Prouvez votre valeur en atteignant 500 points. Le serpent évoluera à mesure que vous progressez.
                    </p>
                </motion.div>

                {!gameWon ? (
                    <SnakeGame onWin={handleWin} />
                ) : (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center bg-myth-purple/40 p-12 rounded-3xl border-2 border-myth-gold shadow-myth-glow"
                    >
                        <h2 className="text-5xl font-bold text-myth-gold mb-8 animate-pulse">
                            VICTOIRE SUPRÊME !
                        </h2>
                        <p className="text-2xl text-white mb-12">
                            Vous avez maîtrisé le Cobra Ultime !
                        </p>
                        <Button size="lg" onClick={handleFinalOpen} className="text-xl px-12 py-6 animate-bounce">
                            OUVRIR LA BOÎTE FINALE
                        </Button>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
