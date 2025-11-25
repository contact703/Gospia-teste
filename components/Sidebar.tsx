"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, User, Music, LogOut, Menu, X, Crown, MessageCircle, Lock } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { PASTORS } from '@/lib/personas';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { useRouter } from 'next/navigation';

export const Sidebar = ({ onOpenSongGenerator }: { onOpenSongGenerator: () => void }) => {
    const { user, tier, selectedPastor, switchPastor } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handlePastorClick = (pastorId: string) => {
        const success = switchPastor(pastorId);
        if (!success) {
            alert("Upgrade para o GospIA Pro para desbloquear este pastor!");
        }
        setIsOpen(false);
    };

    const handleProfileClick = () => {
        router.push('/profile');
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 dark:bg-zinc-800 text-white rounded-md shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <div
                className={cn(
                    "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col text-zinc-900 dark:text-zinc-100 transition-transform duration-300 ease-in-out shadow-xl md:shadow-none",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
                            <span className="text-white dark:text-black font-bold text-xl">G</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">GospIA</h1>
                    </div>
                    {tier === 'Pro' && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-600 dark:text-amber-500 rounded-full border border-amber-500/30 flex items-center gap-1">
                            <Crown size={12} /> PRO
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link
                        href="/chat"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-colors"
                    >
                        <MessageCircle size={20} />
                        Chat Pastoral
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                        <MessageSquarePlus size={20} />
                        Nova Conversa
                    </button>

                    <div className="pt-4 pb-2">
                        <h3 className="px-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                            Pastores
                        </h3>
                        <div className="space-y-1">
                            {PASTORS.map((pastor) => {
                                const isLocked = pastor.tier === 'Pro' && tier === 'Free';
                                const isSelected = selectedPastor.id === pastor.id;

                                return (
                                    <button
                                        key={pastor.id}
                                        onClick={() => handlePastorClick(pastor.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors relative rounded-lg",
                                            isSelected
                                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                                        )}
                                    >
                                        <div className="flex-1 text-left truncate">
                                            {pastor.name}
                                        </div>
                                        {isLocked && <Lock size={14} className="text-zinc-400 dark:text-zinc-600" />}
                                        {pastor.tier === 'Pro' && !isLocked && <Crown size={14} className="text-amber-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={onOpenSongGenerator}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mt-4"
                    >
                        <Music size={20} />
                        Criar Louvor
                        {tier === 'Pro' && <Crown size={14} className="text-amber-500 ml-auto" />}
                    </button>
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                    {user ? (
                        <div className="px-4 py-3 mb-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div className="text-sm font-medium truncate text-zinc-900 dark:text-white">{user.name}</div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</div>
                            <div className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded w-fit">
                                {tier} Plan
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                            <LogOut size={20} />
                            Entrar / Cadastrar
                        </Link>
                    )}

                    <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                        <User size={20} />
                        Perfil
                    </button>

                    <ThemeToggle />
                </div>
            </div>
        </>
    );
};
