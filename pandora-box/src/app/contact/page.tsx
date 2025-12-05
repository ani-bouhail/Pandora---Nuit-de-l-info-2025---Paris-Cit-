"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";

import Image from "next/image";

export default function ContactPage() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            <Navbar />

            <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-myth-purple/30 backdrop-blur-md p-12 rounded-3xl border border-myth-gold/30 shadow-myth-glow max-w-lg w-full"
                >
                    <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-myth-gold shadow-lg">
                        <Image
                            src="/author.jpg"
                            alt="BOUHAIL Anis"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-myth-gold mb-8 text-shadow">
                        Contactez le Webmaster
                    </h1>
                    <p className="text-myth-light/80 mb-8 text-lg">
                        Une question ? Un bug ? Ou juste envie de dire bonjour ?
                    </p>

                    <Button
                        size="lg"
                        onClick={() => window.location.href = "mailto:anis.bouhail@etu.u-paris.fr"}
                        className="w-full"
                    >
                        Envoyer un mail
                    </Button>
                </motion.div>
            </div>
        </main>
    );
}
