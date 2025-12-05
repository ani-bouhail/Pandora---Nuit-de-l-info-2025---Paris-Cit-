"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useGame } from "@/context/GameContext";
import { Home, Info, Mail, RefreshCw } from "lucide-react";

export function Navbar() {
    const router = useRouter();
    const { tokens, resetGame, timeUntilNextToken, resetBestScore } = useGame();

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")} `;
    };

    const handleReset = () => {
        resetGame();
        resetBestScore();
        router.push("/clouds");
    };

    const handleHome = () => {
        resetBestScore();
        // Optional: resetGame() if we want a full reset on home click too
        router.push("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-myth-dark/80 backdrop-blur-md border-b border-myth-purple/30">
            <div className="flex items-center gap-4">
                <button onClick={handleHome} className="text-2xl font-serif font-bold text-myth-gold tracking-widest hover:text-yellow-300 transition-colors">
                    PANDORA
                </button>
                <div className="hidden md:flex items-center gap-2">
                    <button onClick={handleHome}>
                        <Button variant="ghost" size="sm" tabIndex={-1}>
                            <Home className="w-4 h-4 mr-2" /> Accueil
                        </Button>
                    </button>
                    <Link href="/about">
                        <Button variant="ghost" size="sm" tabIndex={-1}>
                            <Info className="w-4 h-4 mr-2" /> À propos
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="ghost" size="sm" tabIndex={-1}>
                            <Mail className="w-4 h-4 mr-2" /> Contact
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Token Counter */}
                <div className="flex items-center gap-3 bg-myth-accent/50 px-4 py-2 rounded-2xl border border-myth-gold/30">
                    <div className="flex flex-col items-end">
                        <span className="text-myth-gold font-bold text-lg leading-none">{tokens} Tokens</span>
                        <span className="text-xs text-myth-light/60">+1 in {formatTime(timeUntilNextToken)}</span>
                    </div>
                </div>

                <Button variant="secondary" size="sm" onClick={handleReset} title="Réinitialiser">
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>
        </nav>
    );
}
