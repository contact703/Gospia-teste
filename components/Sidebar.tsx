'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarProps {
    onOpenSongGenerator: () => void;
}

export const Sidebar = ({ onOpenSongGenerator }: SidebarProps) => {
    const { user, tier, logout, selectedPastor, switchPastor } = useUser();
    const { theme, setTheme } = useTheme();
    const [isChatPastoralOpen, setIsChatPastoralOpen] = useState(true);
    const [isPastorsOpen, setIsPastorsOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const pastors = [
        { id: 'elder', name: 'Pastor Elder', tier: 'Free' },
        { id: 'eduardo', name: 'Pastor Eduardo', tier: 'Pro' },
        { id: 'mario', name: 'Pastor Mario', tier: 'Pro' }
    ];

    const handlePastorClick = (pastorId: string) => {
        const success = switchPastor(pastorId);
        if (success) {
            setIsMobileMenuOpen(false);
        } else {
            // If switch failed (e.g. Pro pastor for Free user), redirect to pricing
            window.location.href = '/pricing';
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <Image
                        src="/gospia-logo.png"
                        alt="Gospia Logo"
                        width={150}
                        height={40}
                        className="h-10 w-auto"
                        priority
                    />
                    {isMobileMenuOpen && (
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden ml-auto p-2 rounded-full hover:bg-dourado-sol dark:hover:bg-zinc-700 text-white"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    )}
                </div>

                <nav className="flex flex-col gap-2">
                    {/* Chat Pastoral Dropdown */}
                    <div className="flex flex-col">
                        <button
                            onClick={() => setIsChatPastoralOpen(!isChatPastoralOpen)}
                            className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-dourado-sol dark:hover:bg-dark-dourado-sol group w-full text-left transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-xl text-texto-branco">chat_bubble_outline</span>
                                <span className="font-medium text-texto-branco">Chat Pastoral</span>
                            </div>
                            <span className={`material-symbols-outlined text-base text-texto-branco transition-transform ${isChatPastoralOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        <AnimatePresence>
                            {isChatPastoralOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="flex flex-col gap-1 mt-2 pl-5 overflow-hidden"
                                >
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-dourado-sol dark:hover:bg-dark-dourado-sol text-texto-branco text-sm w-full text-left transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">add_comment</span>
                                        <span>Nova Conversa</span>
                                    </button>
                                    <button className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-dourado-sol dark:bg-dark-dourado-sol text-texto-branco font-semibold text-sm w-full text-left transition-colors">
                                        <span>Conversa com Pastor E...</span>
                                    </button>
                                    <button className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-dourado-sol dark:hover:bg-dark-dourado-sol text-texto-branco text-sm w-full text-left transition-colors">
                                        <span>Paz no coração</span>
                                    </button>
                                    <button className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-dourado-sol dark:hover:bg-dark-dourado-sol text-texto-branco text-sm w-full text-left transition-colors">
                                        <span>Dúvidas sobre a fé</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Pastores Dropdown */}
                    <div className="flex flex-col mt-2">
                        <button
                            onClick={() => setIsPastorsOpen(!isPastorsOpen)}
                            className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-dourado-sol dark:hover:bg-dark-dourado-sol w-full text-left transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-xl text-texto-branco">groups</span>
                                <span className="font-medium text-texto-branco">Pastores</span>
                            </div>
                            <span className={`material-symbols-outlined text-base text-texto-branco transition-transform ${isPastorsOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        <AnimatePresence>
                            {isPastorsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="flex flex-col gap-1 mt-2 pl-5 overflow-hidden"
                                >
                                    {pastors.map((pastor) => {
                                        const isSelected = selectedPastor.id === pastor.id;
                                        return (
                                            <button
                                                key={pastor.id}
                                                onClick={() => handlePastorClick(pastor.id)}
                                                className={cn(
                                                    "flex items-center justify-between px-4 py-2.5 rounded-lg text-texto-branco text-sm w-full text-left transition-colors",
                                                    isSelected ? "bg-dourado-sol dark:bg-dark-dourado-sol font-semibold" : "hover:bg-dourado-sol dark:hover:bg-dark-dourado-sol"
                                                )}
                                            >
                                                <span>{pastor.name}</span>
                                                {pastor.tier === 'Pro' && (
                                                    <span className="material-symbols-outlined text-base text-texto-branco">lock</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={onOpenSongGenerator}
                        className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg hover:bg-dourado-sol dark:hover:bg-dark-dourado-sol text-texto-branco w-full text-left transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl text-texto-branco">music_note</span>
                        <span>Criar Louvor</span>
                    </button>
                </nav>
            </div>

            <div className="flex flex-col gap-1 border-t border-white/20 dark:border-dark-borda-escura pt-4 mt-auto">
                <div className="flex items-center justify-between p-3 rounded-lg dark:bg-dark-grafite-mais-escuro">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/30 dark:bg-dark-grafite-profundo flex items-center justify-center font-bold text-texto-branco">
                            {user ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <p className="font-semibold text-texto-branco">{user ? user.name : 'Usuário'}</p>
                            <p className="text-sm text-white/80 dark:text-texto-branco">{tier} Plan</p>
                        </div>
                    </div>
                    <button className="text-texto-branco hover:text-dourado-sol dark:hover:text-dark-dourado-sol transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                </div>

                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dourado-sol dark:hover:bg-dark-dourado-sol text-texto-branco transition-colors">
                    <span className="material-symbols-outlined text-xl text-texto-branco">palette</span>
                    <span>Personalização</span>
                </a>

                <a href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dourado-sol dark:hover:bg-dark-dourado-sol text-texto-branco transition-colors">
                    <span className="material-symbols-outlined text-xl text-dourado-sol dark:text-dark-dourado-sol">workspace_premium</span>
                    <span>Assinar Pro</span>
                </a>

                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dourado-sol dark:hover:bg-dark-dourado-sol text-texto-branco w-full text-left transition-colors"
                >
                    <span className="material-symbols-outlined text-xl text-texto-branco">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                    <span>Alternar Tema</span>
                </button>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dourado-sol dark:hover:bg-red-500 text-texto-branco dark:text-red-500 dark:hover:text-white group w-full text-left transition-colors"
                >
                    <span className="material-symbols-outlined text-xl text-texto-branco dark:text-red-500 group-hover:text-white">logout</span>
                    <span className="group-hover:text-white">Sair</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-72 flex-shrink-0 bg-cerulean dark:bg-dark-grafite-profundo p-4 flex-col justify-between hidden lg:flex transition-colors duration-200">
                <SidebarContent />
            </aside>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <aside
                        className="w-72 bg-cerulean dark:bg-dark-grafite-profundo h-full p-4 flex flex-col justify-between transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Mobile Menu Trigger (Hidden here, used in layout/header) */}
            <div className="hidden">
                <button id="mobile-menu-trigger" onClick={() => setIsMobileMenuOpen(true)}>Open Menu</button>
            </div>
        </>
    );
};
