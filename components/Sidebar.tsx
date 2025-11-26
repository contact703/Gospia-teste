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
    const [isChatOpen, setIsChatOpen] = useState(true);
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
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-cerulean text-white rounded-md shadow-lg"
            >
                <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
            </button>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-cerulean p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <img src="/gospia-logo.png" alt="GospIA Logo" className="h-10 w-auto" />
                    </div>

                    <nav className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <button
                                onClick={() => setIsChatOpen(!isChatOpen)}
                                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-dourado-sol w-full text-left transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-xl text-texto-branco">chat_bubble_outline</span>
                                    <span className="font-medium text-texto-branco">Chat Pastoral</span>
                                </div>
                                <span className={cn("material-symbols-outlined text-base text-texto-branco transition-transform", isChatOpen ? "rotate-180" : "")}>expand_more</span>
                            </button>
                            <AnimatePresence>
                                {isChatOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="flex flex-col gap-1 mt-2 pl-5 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-dourado-sol text-texto-branco text-sm w-full text-left transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-xl">add_comment</span>
                                            <span>Nova Conversa</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    <div className="flex flex-col mt-2">
                        <button
                            onClick={() => setIsPastorsOpen(!isPastorsOpen)}
                            className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-dourado-sol w-full text-left transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-xl text-texto-branco">groups</span>
                                <span className="font-medium text-texto-branco">Pastores</span>
                            </div>
                            <span className={cn("material-symbols-outlined text-base text-texto-branco transition-transform", isPastorsOpen ? "rotate-180" : "")}>expand_more</span>
                        </button>
                        <AnimatePresence>
                            {isPastorsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="flex flex-col gap-1 mt-2 pl-5 overflow-hidden"
                                >
                                    {PASTORS.map((pastor) => {
                                        const isLocked = pastor.tier === 'Pro' && tier === 'Free';
                                        const isSelected = selectedPastor.id === pastor.id;

                                        return (
                                            <button
                                                key={pastor.id}
                                                onClick={() => handlePastorClick(pastor.id)}
                                                className={cn(
                                                    "flex items-center justify-between px-4 py-2.5 rounded-lg text-texto-branco text-sm w-full text-left transition-colors",
                                                    isSelected ? "bg-dourado-sol font-semibold" : "hover:bg-dourado-sol"
                                                )}
                                            >
                                                <span>{pastor.name}</span>
                                                {isLocked && <span className="material-symbols-outlined text-base text-texto-branco">lock</span>}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={onOpenSongGenerator}
                        className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg hover:bg-dourado-sol text-texto-branco w-full text-left transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl text-texto-branco">music_note</span>
                        <span>Criar Louvor</span>
                    </button>
                </div>

                <div className="flex flex-col gap-1 border-t border-white/20 pt-4 mt-auto">
                    {user ? (
                        <>
                            <div className="flex items-center justify-between p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/30 flex items-center justify-center font-bold text-texto-branco">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-semibold text-texto-branco truncate w-32">{user.name}</p>
                                        <p className="text-sm text-white/80">{tier === 'Pro' ? 'Pro Plan' : 'Free Plan'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="text-texto-branco hover:text-dourado-sol transition-colors"
                                >
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="flex flex-col gap-1 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dourado-sol text-texto-branco w-full text-left transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-xl text-texto-branco">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                                            <span>Tema {theme === 'dark' ? 'Claro' : 'Escuro'}</span>
                                        </button>
                                        <Link
                                            href="/pricing"
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dourado-sol text-texto-branco w-full text-left transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-xl text-dourado-sol">workspace_premium</span>
                                            <span>{tier === 'Free' ? 'Assinar Pro' : 'Gerenciar Assinatura'}</span>
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dourado-sol text-texto-branco w-full text-left transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-xl text-texto-branco">logout</span>
                                            <span>Sair</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        <Link href="/login" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dourado-sol text-texto-branco w-full text-left transition-colors">
                            <span className="material-symbols-outlined text-xl text-texto-branco">login</span>
                            <span>Entrar / Cadastrar</span>
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
};
