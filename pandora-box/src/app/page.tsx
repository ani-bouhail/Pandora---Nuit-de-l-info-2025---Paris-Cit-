"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { useGame } from "@/context/GameContext";
import { User } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { setGender, gender } = useGame();
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | null>(gender);

  const handleStart = () => {
    if (selectedGender) {
      setGender(selectedGender);
      router.push("/clouds");
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center">
      <Navbar />

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 backdrop-blur-[2px] z-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-myth-gold/10 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-myth-purple/20 rounded-full blur-[100px] animate-pulse-glow delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Column: Content & Login */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 mt-8 text-shadow-lg tracking-wider leading-tight">
              Bienvenue dans <br /> <span className="text-myth-gold">l'Abysse</span>
            </h1>
            <p className="text-xl md:text-2xl text-myth-light/80 max-w-xl font-light leading-relaxed">
              Une énigme millénaire vous sépare du Serpent Légendaire.
              <br />
              Serez-vous celui ou celle qui percera le code ?
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-myth-purple/40 backdrop-blur-lg p-8 rounded-3xl border border-myth-gold/20 shadow-myth-glow w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-myth-light text-center">Identifiez-vous</h2>

            <div className="flex gap-4 justify-center mb-8">
              <button
                onClick={() => setSelectedGender("male")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 border-2 ${selectedGender === "male"
                  ? "bg-myth-gold/20 border-myth-gold scale-105 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                  : "bg-transparent border-myth-light/20 hover:border-myth-gold/50"
                  }`}
              >
                <User className="w-12 h-12 text-myth-light" />
                <span className="font-semibold">Aventurier</span>
              </button>

              <button
                onClick={() => setSelectedGender("female")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 border-2 ${selectedGender === "female"
                  ? "bg-myth-gold/20 border-myth-gold scale-105 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                  : "bg-transparent border-myth-light/20 hover:border-myth-gold/50"
                  }`}
              >
                {/* Female Icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-myth-light"
                >
                  <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
                  <path d="M12 12v9" />
                  <path d="M9 16h6" />
                </svg>
                <span className="font-semibold">Aventurière</span>
              </button>
            </div>

            <Button
              size="lg"
              onClick={handleStart}
              disabled={!selectedGender}
              className={`w-full text-lg font-bold tracking-wide ${!selectedGender ? "opacity-50 cursor-not-allowed" : "animate-pulse-glow"}`}
            >
              COMMENCER L'AVENTURE
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative w-full max-w-md aspect-square">
            <div className="absolute inset-0 bg-myth-gold/20 rounded-full blur-3xl animate-pulse-slow" />
            <Image
              src="/logo.png"
              alt="Nuit de l'Info 2025"
              width={500}
              height={500}
              className="relative z-10 object-contain drop-shadow-[0_0_30px_rgba(14,165,233,0.6)] hover:scale-105 transition-transform duration-500"
            />
          </div>
        </motion.div>

      </div>
    </main>
  );
}
