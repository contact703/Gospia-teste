"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { PastorTier } from '@/lib/personas';
import { Check, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

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
        if (selectedTier === 'Free') {
            login(name, email, 'Free');
            onClose();
            router.push('/chat');
        } else {
            // For Pro, we start as Free and redirect to pricing to complete upgrade
            login(name, email, 'Free');
            onClose();
            router.push('/pricing');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl transition-colors duration-300"
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 text-center">Bem-vindo ao GospIA</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-center mb-6">Seu conselheiro pastoral virtual.</p>

                    {step === 'details' ? (
                        <form onSubmit={handleDetailsSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-600 transition-colors"
                                    placeholder="Seu nome"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-600 transition-colors"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Continuar
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-white text-center mb-4">Escolha seu plano</h3>

                            {/* Free Tier */}
                            <div
                                onClick={() => handleTierSelect('Free')}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedTier === 'Free'
                                    ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-900 dark:border-white'
                                    : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-zinc-900 dark:text-white">GospIA Free</div>
                                        <div className="text-sm text-zinc-500 dark:text-zinc-400">Acesso ao Pastor Elder</div>
                                    </div>
                                    {selectedTier === 'Free' && <Check className="text-zinc-900 dark:text-white" size={20} />}
                                </div>
                            </div>

                            {/* Pro Tier */}
                            <div
                                onClick={() => handleTierSelect('Pro')}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedTier === 'Pro'
                                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500'
                                    : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-amber-600 dark:text-amber-500 flex items-center gap-2">
                                            GospIA Pro <Crown size={14} />
                                        </div>
                                        <div className="text-sm text-zinc-500 dark:text-zinc-400">Todos os pastores + Louvor</div>
                                    </div>
                                    {selectedTier === 'Pro' && <Check className="text-amber-600 dark:text-amber-500" size={20} />}
                                </div>
                            </div>

                            <button
                                onClick={handleFinalSubmit}
                                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity mt-4"
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
