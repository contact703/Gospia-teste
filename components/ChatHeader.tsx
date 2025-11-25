"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crown, Lock } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { PASTORS } from '@/lib/personas';
import { cn } from '@/lib/utils';

export const ChatHeader = () => {
    const { selectedPastor, switchPastor, tier } = useUser();
    const [isPastorDropdownOpen, setIsPastorDropdownOpen] = useState(false);

    const handlePastorSelect = (pastorId: string) => {
        const success = switchPastor(pastorId);
        if (!success) {
            alert("Upgrade para o GospIA Pro para desbloquear este pastor!");
        }
        setIsPastorDropdownOpen(false);
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/50 backdrop-blur-md z-20 transition-colors duration-300">
            <div className="relative">
                <button
                    onClick={() => setIsPastorDropdownOpen(!isPastorDropdownOpen)}
                    className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                    {selectedPastor.name}
                    <ChevronDown size={16} className={`transition-transform ${isPastorDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isPastorDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsPastorDropdownOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-20"
                            >
                                {PASTORS.map((pastor) => {
                                    const isLocked = pastor.tier === 'Pro' && tier === 'Free';
                                    return (
                                        <button
                                            key={pastor.id}
                                            onClick={() => handlePastorSelect(pastor.id)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0",
                                                selectedPastor.id === pastor.id
                                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                                            )}
                                        >
                                            <span className="flex items-center gap-2">
                                                {pastor.name}
                                                {pastor.tier === 'Pro' && !isLocked && <Crown size={12} className="text-amber-500" />}
                                            </span>
                                            {isLocked && <Lock size={14} className="text-zinc-400 dark:text-zinc-600" />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
