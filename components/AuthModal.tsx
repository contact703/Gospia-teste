"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { PastorTier } from '@/lib/personas';
import { Check, Crown } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void; // Optional, as it might be forced open
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const { login } = useUser();
    const [step, setStep] = useState<'details' | 'tier'>('details');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedTier, setSelectedTier] = useState<PastorTier>('Free');

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email) {
            setStep('tier');
        }
    };

    const handleTierSelect = (tier: PastorTier) => {
        setSelectedTier(tier);
    };

    const handleFinalSubmit = () => {
        login(name, email, selectedTier);
        // We don't need to close manually if the parent component handles visibility based on user state
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2 text-center">Bem-vindo ao GospIA</h2>
                    <p className="text-zinc-400 text-center mb-6">Seu conselheiro pastoral virtual.</p>

                    {step === 'details' ? (
                        <form onSubmit={handleDetailsSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-zinc-600"
                                    placeholder="Seu nome"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-zinc-600"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-zinc-200 transition-colors"
                            >
                                Continuar
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white text-center mb-4">Escolha seu plano</h3>

                            {/* Free Tier */}
                            <div
                                onClick={() => handleTierSelect('Free')}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedTier === 'Free'
                                        ? 'bg-zinc-800 border-white'
                                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-white">GospIA Free</div>
                                        <div className="text-sm text-zinc-400">Acesso ao Pastor Elder</div>
                                    </div>
                                    {selectedTier === 'Free' && <Check className="text-white" size={20} />}
                                </div>
                            </div>

                            {/* Pro Tier */}
                            <div
                                onClick={() => handleTierSelect('Pro')}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedTier === 'Pro'
                                        ? 'bg-amber-950/30 border-amber-500'
                                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-amber-500 flex items-center gap-2">
                                            GospIA Pro <Crown size={14} />
                                        </div>
                                        <div className="text-sm text-zinc-400">Todos os pastores + Louvor</div>
                                    </div>
                                    {selectedTier === 'Pro' && <Check className="text-amber-500" size={20} />}
                                </div>
                            </div>

                            <button
                                onClick={handleFinalSubmit}
                                className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-zinc-200 transition-colors mt-4"
                            >
                                Entrar como {selectedTier}
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
