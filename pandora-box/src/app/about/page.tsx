"use client";

import { Navbar } from "@/components/ui/Navbar";
import { motion } from "framer-motion";

import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="min-h-screen relative overflow-hidden flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-myth-purple/40 backdrop-blur-md p-12 rounded-3xl border border-myth-gold/20 shadow-myth-glow max-w-3xl w-full"
                >
                    <Image
                        src="/logo.png"
                        alt="Nuit de l'Info 2025"
                        width={200}
                        height={100}
                        className="mx-auto mb-8"
                    />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-myth-gold mb-8 text-shadow">
                        À Propos de Pandora's Box
                    </h1>

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-myth-gold shadow-lg shrink-0">
                            <Image
                                src="/author.jpg"
                                alt="BOUHAIL Anis"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6 text-myth-light/90 text-lg leading-relaxed text-left">
                            <p>
                                Ce projet a été réalisé dans le cadre de la <strong className="text-myth-gold">Nuit de l'Info 2025</strong>.
                                L'objectif était de créer une expérience web immersive et ludique, mêlant énigmes, chance et adresse.
                            </p>
                            <p>
                                Le thème de cette année nous invitait à explorer les mythes et légendes, d'où le choix de la Boîte de Pandore.
                                À travers différentes épreuves, le joueur est amené à "retrouver" la boîte et à en découvrir le contenu... surprenant !
                            </p>
                            <p>
                                Technologies utilisées : Next.js, Tailwind CSS, Framer Motion, Canvas API.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <footer className="py-6 text-center text-myth-light/40 text-sm border-t border-myth-light/5 bg-myth-dark/50 backdrop-blur-sm">
                <p>© 2025 Pandora's Box. Tous droits réservés.</p>
                <p className="mt-1">Auteur : <span className="text-myth-gold">BOUHAIL Anis</span></p>
            </footer>
        </main>
    );
}
