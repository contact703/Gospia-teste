"use client";

import React from 'react';
import { Check, Crown } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { upgrade } = useUser();
    const router = useRouter();

    const handleSubscribe = () => {
        // Simulate payment processing
        setTimeout(() => {
            upgrade();
            router.push('/chat');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                    GospIA Pro <Crown className="text-amber-500" size={32} />
                </h1>
                <p className="text-zinc-400 max-w-lg mx-auto">
                    Desbloqueie todo o potencial do seu conselheiro pastoral virtual.
                    Acesso ilimitado a todos os pastores e criação de louvores.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                {/* Mensal */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col hover:border-zinc-700 transition-colors">
                    <h3 className="text-xl font-semibold mb-2">Mensal</h3>
                    <div className="mb-6">
                        <span className="text-3xl font-bold">R$ 80,00</span>
                        <span className="text-zinc-500">/mês</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-2 text-sm text-zinc-300">
                            <Check size={16} className="text-amber-500" /> Todos os Pastores
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-300">
                            <Check size={16} className="text-amber-500" /> Criar Louvores
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-300">
                            <Check size={16} className="text-amber-500" /> Sem limites
                        </li>
                    </ul>
                    <button
                        onClick={handleSubscribe}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Assinar Mensal
                    </button>
                </div>

                {/* Trimestral */}
                <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col relative transform md:-translate-y-4 shadow-xl shadow-amber-900/10">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                        MAIS POPULAR
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-amber-500">Trimestral</h3>
                    <div className="mb-6">
                        <span className="text-3xl font-bold">R$ 60,00</span>
                        <span className="text-zinc-500">/mês</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-6">Cobrado trimestralmente (R$ 180,00)</p>
                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-2 text-sm text-zinc-300">
                            <Check size={16} className="text-amber-500" /> Todos os Pastores
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-300">
                            <Check size={16} className="text-amber-500" /> Criar Louvores
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-300">
                            <Check size={16} className="text-amber-500" /> Prioridade no suporte
                        </li>
                    </ul>
                    <button
                        onClick={handleSubscribe}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition-colors"
                    >
                        Assinar Trimestral
                    </button>
                </div>

                {/* Anual */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col hover:border-zinc-700 transition-colors">
                    <h3 className="text-xl font-semibold mb-2">Anual</h3>
                    <div className="mb-6">
                        <span className="text-3xl font-bold">R$ 30,00</span>
                        <span className="text-zinc-500">/mês</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-6">Cobrado anualmente (R$ 360,00)</p>
                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-2 text-sm text-zinc-300">
                            <Check size={16} className="text-amber-500" /> Todos os Pastores
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-300">
                            <Check size={16} className="text-amber-500" /> Criar Louvores
                        </li>
                        <li className="flex items-center gap-2 text-sm text-zinc-300">
                            <Check size={16} className="text-amber-500" /> Maior economia
                        </li>
                    </ul>
                    <button
                        onClick={handleSubscribe}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Assinar Anual
                    </button>
                </div>
            </div>
        </div>
    );
}
