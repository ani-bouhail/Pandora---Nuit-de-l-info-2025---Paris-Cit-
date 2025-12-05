"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";
import { NoTokensModal } from "@/components/NoTokensModal";
import { motion } from "framer-motion";
import { Eye, Lock, Unlock } from "lucide-react";

const HINTS = [
    { id: 1, cost: 8, text: "Le secret est dans le sujet principal de la nuit de l’info" },
    { id: 2, cost: 8, text: "Un symbole représentatif de l’Afrique du Nord se cache quelque part au milieu.." },
    { id: 3, cost: 8, text: "Les nombres ne s’écrivent pas toujours en chiffres (meuf/mec selon sexe) tu sais ?!" },
    { id: 4, cost: 8, text: "En majuscules c’est vachement mieux en vrai" },
];

const CORRECT_CODE = "NIRD♓️2M25";

export default function RiddlePage() {
    const router = useRouter();
    const { tokens, decrementTokens, gender, unlockStage } = useGame();
    const [code, setCode] = useState("");
    const [revealedHints, setRevealedHints] = useState<number[]>([]);
    const [showNoTokens, setShowNoTokens] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleRevealHint = (id: number, cost: number) => {
        if (revealedHints.includes(id)) return;

        if (decrementTokens(cost)) {
            setRevealedHints((prev) => [...prev, id]);
        } else {
            setShowNoTokens(true);
        }
    };

    const handleFakeAnswer = () => {
        if (decrementTokens(5)) {
            setError("Eh bah ! Toi tu imagines vraiment la vie en rose, 5 tokens en l’air 😝");
        } else {
            setShowNoTokens(true);
        }
    };

    const handleSubmit = () => {
        setShowFeedback(true);
        if (code === CORRECT_CODE) {
            setSuccess(true);
            unlockStage(4);
            // Animation handled by UI, then redirect
        } else {
            setError("Code incorrect ! La boîte reste scellée.");
            // Reset error after 3 seconds
            setTimeout(() => setError(""), 3000);
        }
    };

    const getHintText = (hint: typeof HINTS[0]) => {
        let text = hint.text;
        if (hint.id === 3) {
            text = text.replace("(meuf/mec selon sexe)", gender === "female" ? "meuf" : "mec");
        }
        return text;
    };

    const renderCodeInput = () => {
        // Use Intl.Segmenter to split by graphemes (handling emojis correctly)
        const segmenter = new Intl.Segmenter("fr", { granularity: "grapheme" });
        const correctSegments = [...segmenter.segment(CORRECT_CODE)].map(s => s.segment);
        const codeSegments = [...segmenter.segment(code)].map(s => s.segment);

        const maxLength = 9;
        const slots = Array.from({ length: maxLength });

        return (
            <div className="relative flex justify-center gap-1 md:gap-2 mb-8">
                {/* Hidden Input for typing */}
                <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                        const newCode = e.target.value;
                        const newSegments = [...segmenter.segment(newCode)];
                        if (newSegments.length <= maxLength) {
                            setCode(newCode);
                            setShowFeedback(false); // Hide feedback when typing
                            setError("");
                        }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20"
                    autoFocus
                />

                {/* Visual Display */}
                {slots.map((_, index) => {
                    const char = codeSegments[index] || "";
                    const isCorrect = showFeedback && char === correctSegments[index];
                    const showCheck = showFeedback && isCorrect;

                    // Add extra margin after NIRD (index 3) and ♓️ (index 4)
                    const isGap = index === 3 || index === 4;

                    return (
                        <div key={index} className={`flex flex-col items-center gap-1 ${isGap ? "mr-4 md:mr-8" : ""}`}>
                            <div
                                className={`
                                    w-8 h-12 md:w-10 md:h-14 flex items-center justify-center 
                                    rounded-lg border-2 text-xl md:text-2xl font-mono font-bold transition-all duration-300
                                    ${isCorrect
                                        ? "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                        : "bg-myth-dark/50 border-myth-gold/30 text-myth-light"
                                    }
                                    ${!isCorrect && showFeedback && char ? "border-red-500/50 text-red-400" : ""}
                                `}
                            >
                                {char}
                            </div>
                            {showCheck && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-xs md:text-sm"
                                >
                                    ✅
                                </motion.span>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (success) {
        return (
            <main className="min-h-screen bg-myth-dark flex flex-col items-center justify-center text-center p-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-myth-gold mb-8 animate-pulse-glow">
                        Numérique Inclusif Responsable Durable 2025
                    </h1>
                    <h2 className="text-2xl md:text-4xl text-myth-light mb-12">
                        BRAVOOOO ! T’es {gender === "female" ? "une vraie HACKEUSE" : "un vrai HACKER"} !
                    </h2>
                    <Button size="lg" onClick={() => router.push("/snake")} className="animate-bounce">
                        <Unlock className="w-6 h-6 mr-2" />
                        Ouvrir la boite
                    </Button>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-myth-dark pb-20">
            <Navbar />
            <NoTokensModal isOpen={showNoTokens} onClose={() => setShowNoTokens(false)} />

            <div className="pt-32 px-4 max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-myth-gold mb-12 text-shadow">
                        Tu as retrouvé la boite ! Essaye donc de l’ouvrir !
                    </h1>

                    <div className="bg-myth-purple/30 backdrop-blur-md p-8 rounded-3xl border border-myth-gold/30 shadow-myth-glow mb-12">
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <Lock className="w-8 h-8 text-myth-gold mb-6" />
                            {renderCodeInput()}
                        </div>

                        <Button size="lg" onClick={handleSubmit} className="w-full max-w-md">
                            Déverrouiller
                        </Button>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 text-myth-red font-bold"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {HINTS.map((hint) => (
                            <div key={hint.id} className="bg-myth-accent/40 p-6 rounded-2xl border border-myth-light/10">
                                {revealedHints.includes(hint.id) ? (
                                    <p className="text-myth-gold font-medium">{getHintText(hint)}</p>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => handleRevealHint(hint.id, hint.cost)}
                                        className="w-full"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Divulguer indice {hint.id} ({hint.cost} tokens)
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        onClick={handleFakeAnswer}
                        className="text-myth-light/50 hover:text-myth-red transition-colors"
                    >
                        Réponse (5 tokens)
                    </Button>
                </motion.div>
            </div>
        </main>
    );
}
