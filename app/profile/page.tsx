"use client";

import React from 'react';
import { useUser } from '@/context/UserContext';
import { User, Mail, Crown } from 'lucide-react';

export default function ProfilePage() {
    const { user, tier } = useUser();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <p>Você não está autenticado.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-8 bg-black text-zinc-100 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

            <div className="max-w-2xl w-full space-y-6">
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-zinc-400 text-sm">Membro desde 2024</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                            <div className="flex items-center gap-3 text-zinc-400">
                                <Mail size={20} />
                                <span>Email</span>
                            </div>
                            <span className="text-white font-medium">{user.email}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                            <div className="flex items-center gap-3 text-zinc-400">
                                <Crown size={20} className={tier === 'Pro' ? "text-amber-500" : ""} />
                                <span>Plano Atual</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`font-bold ${tier === 'Pro' ? "text-amber-500" : "text-white"}`}>
                                    {tier}
                                </span>
                                {tier === 'Free' && (
                                    <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                                        Básico
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {tier === 'Free' && (
                    <div className="bg-amber-950/20 p-6 rounded-xl border border-amber-500/30">
                        <h3 className="text-lg font-semibold text-amber-500 mb-2 flex items-center gap-2">
                            <Crown size={20} />
                            Faça Upgrade para o Pro
                        </h3>
                        <p className="text-zinc-400 mb-4">
                            Desbloqueie todos os pastores, crie louvores ilimitados e tenha acesso prioritário.
                        </p>
                        <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded-lg transition-colors">
                            Ver Planos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
