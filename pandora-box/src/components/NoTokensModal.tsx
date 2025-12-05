"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { useGame } from "@/context/GameContext";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";

interface NoTokensModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NoTokensModal({ isOpen, onClose }: NoTokensModalProps) {
    const { resetGame } = useGame();

    const handleReset = () => {
        resetGame();
        onClose();
        // Ideally redirect to home or stay here with reset tokens
        window.location.href = "/";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-myth-dark border-2 border-myth-red p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
                    >
                        <AlertTriangle className="w-16 h-16 text-myth-red mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-myth-light mb-4">Plus de tokens !</h2>
                        <p className="text-myth-light/80 mb-8">
                            Vous avez épuisé vos ressources. Le destin est cruel...
                        </p>

                        <div className="flex flex-col gap-4">
                            <Button variant="danger" onClick={handleReset} className="w-full">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Réinitialiser (Retour Accueil)
                            </Button>
                            <Button variant="secondary" onClick={onClose} className="w-full">
                                <Clock className="w-4 h-4 mr-2" />
                                Attendre (40 min pour 8 tok ☠️)
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
