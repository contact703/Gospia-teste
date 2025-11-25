"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, User, Music, LogOut, Menu, X, Crown, MessageCircle, Lock } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { PASTORS } from '@/lib/personas';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Utility for class merging is imported from @/lib/utils

export const Sidebar = ({ onOpenSongGenerator }: { onOpenSongGenerator: () => void }) => {
    const { user, tier, logout, selectedPastor, switchPastor } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleSongClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onOpenSongGenerator();
    };

    const handlePastorClick = (pastorId: string) => {
        const success = switchPastor(pastorId);
        if (!success) {
            alert("Upgrade para o GospIA Pro para desbloquear este pastor!");
        }
    };
    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 text-white rounded-md"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <motion.div
                className={cn(
                    "fixed md:static inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col text-zinc-100 transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">GospIA</h1>
                    {tier === 'Pro' && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/30 flex items-center gap-1">
                            <Crown size={12} /> PRO
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white"
                    >
                        <MessageCircle size={20} />
                        Chat Pastoral
                    </Link>

                    <button
                        onClick={() => window.location.reload()} // Simple way to reset chat for now
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white"
                    >
                        <MessageSquarePlus size={20} />
                        Nova Conversa
                    </button>

                    <div className="pt-4 pb-2">
                        <h3 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
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
                                            "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors relative",
                                            isSelected
                                                ? "bg-zinc-800 text-white border-r-2 border-white"
                                                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                        )}
                                    >
                                        <div className="flex-1 text-left truncate">
                                            {pastor.name}
                                        </div>
                                        {isLocked && <Lock size={14} className="text-zinc-600" />}
                                        {pastor.tier === 'Pro' && !isLocked && <Crown size={14} className="text-amber-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-zinc-800 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white">
                        <User size={20} />
                        Perfil
                    </button>

                    <button
                        onClick={handleSongClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white"
                    >
                        <Music size={20} />
                        Criar Louvor
                        {tier === 'Free' && <span className="ml-auto text-xs opacity-50">PRO</span>}
                    </button>

                    {user ? (
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-red-950/30 text-red-400 transition-colors"
                        >
                            <LogOut size={20} />
                            Sair
                        </button>
                    ) : (
                        <div className="px-4 py-2 text-xs text-zinc-500 text-center">
                            Não autenticado
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};
