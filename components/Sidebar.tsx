"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Music, LogOut, Menu, X, Crown, MessageCircle, Lock, MoreHorizontal, Sun, Moon, CreditCard, ChevronDown } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { PASTORS } from '@/lib/personas';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

export const Sidebar = ({ onOpenSongGenerator }: { onOpenSongGenerator: () => void }) => {
    const { user, tier, selectedPastor, switchPastor, logout } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPastorsOpen, setIsPastorsOpen] = useState(true);
    const { theme, setTheme } = useTheme();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handlePastorClick = (pastorId: string) => {
        const success = switchPastor(pastorId);
        if (!success) {
            alert("Upgrade para o GospIA Pro para desbloquear este pastor!");
        }
        setIsOpen(false);
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
                        <button
                            onClick={() => setIsPastorsOpen(!isPastorsOpen)}
                            className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                        >
                            PASTORES
                            <ChevronDown
                                size={14}
                                className={cn("transition-transform duration-200", isPastorsOpen ? "rotate-180" : "")}
                            />
                        </button>
                        <AnimatePresence>
                            {isPastorsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-1 mt-1">
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
                                </motion.div>
                            )}
                        </AnimatePresence>
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

                {/* Bottom Section - User Profile Dropdown */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 relative">
                    {user ? (
                        <div className="relative">
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsProfileOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.1 }}
                                            className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-20"
                                        >
                                            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                                                <div className="text-sm font-medium text-zinc-900 dark:text-white truncate">{user.name}</div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${tier === 'Pro'
                                                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/30'
                                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                                                        }`}>
                                                        {tier}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-1">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setTheme(theme === 'dark' ? 'light' : 'dark');
                                                        }}
                                                        title={theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
                                                        className="flex items-center justify-center p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                                    >
                                                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                                    </button>
                                                </div>

                                                <Link
                                                    href="/pricing"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                                >
                                                    {tier === 'Free' ? <Crown size={16} className="text-amber-500" /> : <CreditCard size={16} />}
                                                    {tier === 'Free' ? 'Assinar Pro' : 'Gerenciar Assinatura'}
                                                </Link>

                                                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />

                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                                >
                                                    <LogOut size={16} />
                                                    Sair
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-medium group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 transition-colors">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <div className="text-sm font-medium text-zinc-900 dark:text-white truncate">{user.name}</div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                        {tier === 'Pro' ? 'Pro Plan' : 'Free Plan'}
                                    </div>
                                </div>
                                <MoreHorizontal size={16} className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                            <LogOut size={20} />
                            Entrar / Cadastrar
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};
