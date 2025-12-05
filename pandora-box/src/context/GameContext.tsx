"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Gender = "male" | "female" | null;

interface GameContextType {
    tokens: number;
    gender: Gender;
    unlockedStages: number[];
    setGender: (gender: Gender) => void;
    decrementTokens: (amount: number) => boolean;
    addTokens: (amount: number) => void;
    unlockStage: (stage: number) => void;
    resetGame: () => void;
    timeUntilNextToken: number; // in seconds
    bestScore: number;
    updateBestScore: (score: number) => void;
    resetBestScore: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [tokens, setTokens] = useState(50);
    const [gender, setGender] = useState<Gender>(null);
    const [unlockedStages, setUnlockedStages] = useState<number[]>([1]);
    const [timeUntilNextToken, setTimeUntilNextToken] = useState(60); // 1 minute in seconds
    const [bestScore, setBestScore] = useState(0);

    // Load best score from local storage
    useEffect(() => {
        const saved = localStorage.getItem("snakeBestScore");
        if (saved) setBestScore(parseInt(saved));
    }, []);

    // Save best score
    const updateBestScore = (score: number) => {
        if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem("snakeBestScore", score.toString());
        }
    };

    const resetBestScore = () => {
        setBestScore(0);
        localStorage.setItem("snakeBestScore", "0");
    };

    // Token regeneration timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeUntilNextToken((prev) => {
                if (prev <= 1) {
                    setTokens((t) => t + 1);
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const decrementTokens = (amount: number) => {
        if (tokens >= amount) {
            setTokens((prev) => prev - amount);
            return true;
        }
        return false;
    };

    const addTokens = (amount: number) => {
        setTokens((prev) => prev + amount);
    };

    const unlockStage = (stage: number) => {
        if (!unlockedStages.includes(stage)) {
            setUnlockedStages((prev) => [...prev, stage]);
        }
    };

    const resetGame = () => {
        setTokens(50);
        setUnlockedStages([1]);
        // Gender persists or resets? "reinitialise les tokens et le nombre de nuages"
        // Usually gender selection is once, but maybe reset everything.
        // User said "reinitialise les tokens et le nombre de nuages".
        // I'll keep gender for now, but maybe reset it if requested.
    };

    return (
        <GameContext.Provider
            value={{
                tokens,
                gender,
                unlockedStages,
                setGender,
                decrementTokens,
                addTokens,
                unlockStage,
                resetGame,
                timeUntilNextToken,
                bestScore,
                updateBestScore,
                resetBestScore,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}
