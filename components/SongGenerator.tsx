"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music } from 'lucide-react';

interface SongGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SongGenerator = ({ isOpen, onClose }: SongGeneratorProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 m-auto w-full max-w-2xl h-[600px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
                    >
                        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                            <div className="flex items-center gap-2">
                                <Music className="text-amber-500" size={20} />
                                <h2 className="text-lg font-semibold text-white">Gerador de Louvor (Suno API)</h2>
                            </div>
                            <button onClick={onClose} className="text-zinc-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                <Music size={32} className="text-zinc-500" />
                            </div>
                            <h3 className="text-xl font-medium text-white">Em Breve</h3>
                            <p className="text-zinc-400 max-w-md">
                                A integração com a API da Suno para geração de louvores estará disponível em breve para usuários Pro.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
