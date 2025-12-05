"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/Button";
import { useGame } from "@/context/GameContext";
import confetti from "canvas-confetti";

const GRID_SIZE = 20;
const SPEED = 150;
const MAX_SCORE = 300;

type Point = { x: number; y: number };

interface SnakeGameProps {
    onWin: () => void;
}

export function SnakeGame({ onWin }: SnakeGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Point>({ x: 15, y: 15 });
    const [direction, setDirection] = useState<Point>({ x: 0, y: 0 });
    const directionRef = useRef<Point>({ x: 0, y: 0 }); // Ref to track direction in game loop without resetting interval
    const canChangeDirection = useRef(true); // Lock to prevent multiple direction changes per tick

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { bestScore, updateBestScore, resetBestScore } = useGame();

    // Sync direction state to ref
    useEffect(() => {
        directionRef.current = direction;
    }, [direction]);

    // Themes based on score
    const getTheme = (currentScore: number) => {
        if (currentScore >= 200) return {
            name: "COSMIC",
            snakeColor: "#a855f7",
            snakeGlow: "0 0 20px #a855f7",
            foodColor: "#e879f9",
            bgGradient: "linear-gradient(to bottom right, #0f172a, #3b0764)"
        };
        if (currentScore >= 100) return {
            name: "JUNGLE",
            snakeColor: "#22c55e",
            snakeGlow: "0 0 15px #22c55e",
            foodColor: "#facc15",
            bgGradient: "linear-gradient(to bottom right, #022c22, #14532d)"
        };
        return {
            name: "BASIC",
            snakeColor: "#0ea5e9",
            snakeGlow: "0 0 10px #0ea5e9",
            foodColor: "#ef4444",
            bgGradient: "linear-gradient(to bottom right, #0f172a, #1e293b)"
        };
    };

    const currentTheme = getTheme(score);

    // Initialize game
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault(); // Prevent scrolling
            }

            if (!isPlaying && !gameOver && !gameWon && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                setIsPlaying(true);
            }

            // Prevent multiple direction changes in one tick
            if (!canChangeDirection.current) return;

            const currentDir = directionRef.current;

            switch (e.key) {
                case "ArrowUp":
                    if (currentDir.y === 0) {
                        setDirection({ x: 0, y: -1 });
                        canChangeDirection.current = false;
                    }
                    break;
                case "ArrowDown":
                    if (currentDir.y === 0) {
                        setDirection({ x: 0, y: 1 });
                        canChangeDirection.current = false;
                    }
                    break;
                case "ArrowLeft":
                    if (currentDir.x === 0) {
                        setDirection({ x: -1, y: 0 });
                        canChangeDirection.current = false;
                    }
                    break;
                case "ArrowRight":
                    if (currentDir.x === 0) {
                        setDirection({ x: 1, y: 0 });
                        canChangeDirection.current = false;
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, gameOver, gameWon]); // Removed direction from deps to prevent listener recreation

    // Game Loop
    useEffect(() => {
        if (!isPlaying || gameOver || gameWon) return;

        const moveSnake = setInterval(() => {
            setSnake((prevSnake) => {
                const currentDir = directionRef.current;
                const newHead = {
                    x: prevSnake[0].x + currentDir.x,
                    y: prevSnake[0].y + currentDir.y,
                };

                // Check collisions
                if (
                    newHead.x < 0 || newHead.x >= GRID_SIZE ||
                    newHead.y < 0 || newHead.y >= GRID_SIZE ||
                    prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
                ) {
                    setGameOver(true);
                    updateBestScore(score);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check food
                if (newHead.x === food.x && newHead.y === food.y) {
                    const newScore = score + 10;
                    setScore(newScore);

                    if (newScore >= MAX_SCORE) {
                        setGameWon(true);
                        updateBestScore(newScore);
                        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
                        onWin(); // Notify parent
                    } else {
                        // Spawn new food
                        let newFood: Point;
                        do {
                            newFood = {
                                x: Math.floor(Math.random() * GRID_SIZE),
                                y: Math.floor(Math.random() * GRID_SIZE),
                            };
                        } while (newSnake.some(s => s.x === newFood.x && s.y === newFood.y));
                        setFood(newFood);
                    }
                } else {
                    newSnake.pop();
                }

                // Allow direction change for next tick
                canChangeDirection.current = true;

                return newSnake;
            });
        }, SPEED);

        return () => clearInterval(moveSnake);
    }, [isPlaying, food, gameOver, gameWon, score, updateBestScore, onWin]); // Removed direction from deps

    // Render
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const cellSize = canvas.width / GRID_SIZE;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Background Grid (Subtle)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }

        // Draw Snake
        snake.forEach((segment, index) => {
            ctx.fillStyle = currentTheme.snakeColor;
            ctx.shadowBlur = 15;
            ctx.shadowColor = currentTheme.snakeColor;

            // Head is slightly larger
            if (index === 0) {
                ctx.beginPath();
                ctx.arc(
                    segment.x * cellSize + cellSize / 2,
                    segment.y * cellSize + cellSize / 2,
                    cellSize / 2 + 2,
                    0,
                    2 * Math.PI
                );
                ctx.fill();

                // Eyes
                ctx.fillStyle = "white";
                const currentDir = directionRef.current;
                ctx.beginPath();
                ctx.arc(
                    segment.x * cellSize + cellSize / 2 + (currentDir.x * 4) - (currentDir.y * 4),
                    segment.y * cellSize + cellSize / 2 + (currentDir.y * 4) - (currentDir.x * 4),
                    2, 0, 2 * Math.PI
                );
                ctx.arc(
                    segment.x * cellSize + cellSize / 2 + (currentDir.x * 4) + (currentDir.y * 4),
                    segment.y * cellSize + cellSize / 2 + (currentDir.y * 4) + (currentDir.x * 4),
                    2, 0, 2 * Math.PI
                );
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.roundRect(
                    segment.x * cellSize + 2,
                    segment.y * cellSize + 2,
                    cellSize - 4,
                    cellSize - 4,
                    4
                );
                ctx.fill();
            }
            ctx.shadowBlur = 0;
        });

        // Draw Food
        ctx.fillStyle = currentTheme.foodColor;
        ctx.shadowBlur = 20;
        ctx.shadowColor = currentTheme.foodColor;
        ctx.beginPath();
        ctx.arc(
            food.x * cellSize + cellSize / 2,
            food.y * cellSize + cellSize / 2,
            cellSize / 2 - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.shadowBlur = 0;

    }, [snake, food, currentTheme]); // Removed direction from deps, using ref for drawing eyes might lag slightly if not careful, but we sync ref. Actually, for render we can use state 'direction' if we want immediate feedback, but 'directionRef' is safer for consistency. Let's use directionRef for eyes too.

    const reset = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: 15, y: 15 });
        setDirection({ x: 0, y: 0 });
        directionRef.current = { x: 0, y: 0 };
        canChangeDirection.current = true;
        setScore(0);
        resetBestScore(); // Reset best score
        setGameOver(false);
        setGameWon(false);
        setIsPlaying(false);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
            <div className="flex justify-between w-full px-4 items-end">
                <div className="text-left">
                    <p className="text-sm text-myth-light/60">MEILLEUR SCORE</p>
                    <p className="text-2xl font-bold text-myth-gold">{bestScore}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-myth-light/60">THEME</p>
                    <p className="text-xl font-bold" style={{ color: currentTheme.snakeColor }}>{currentTheme.name}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-myth-light/60">SCORE</p>
                    <p className="text-4xl font-bold text-white">{score} <span className="text-sm text-myth-light/40">/ {MAX_SCORE}</span></p>
                </div>
            </div>

            <div
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-myth-gold/30"
                style={{ background: currentTheme.bgGradient }}
            >
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    className="w-full max-w-[500px] aspect-square block cursor-pointer"
                    onClick={() => !isPlaying && !gameOver && !gameWon && setIsPlaying(true)}
                />

                {/* Overlay Messages */}
                {(!isPlaying && !gameOver && !gameWon) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <p className="text-2xl font-bold text-white animate-pulse">Appuyez pour commencer</p>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md z-10">
                        <h2 className="text-5xl font-bold text-myth-red mb-4">PERDU !</h2>
                        <p className="text-xl text-myth-light mb-8">Score final : {score}</p>
                        <Button onClick={reset} variant="primary" size="lg">Rejouer</Button>
                    </div>
                )}

                {gameWon && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-myth-gold/20 backdrop-blur-md z-10">
                        <h2 className="text-5xl font-bold text-myth-gold mb-4 text-shadow-lg">VICTOIRE !</h2>
                        <p className="text-xl text-white mb-8">Vous avez vaincu le Serpent !</p>
                        <div className="animate-bounce text-6xl">🎁</div>
                    </div>
                )}
            </div>

            <div className="text-myth-light/40 text-sm">
                Utilisez les flèches directionnelles pour jouer
            </div>
        </div>
    );
}
