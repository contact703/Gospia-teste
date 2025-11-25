"use client";

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useUser();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Mock password
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Mock login - in a real app, validate credentials
            // For now, we assume if they have an account, they are Free unless stored otherwise
            // But since we don't have a backend, we'll just log them in as Free (or retrieve from local storage if we could, but context handles that on load)
            // Actually, context `login` sets new user. 
            // Let's just mock a "Welcome back" flow.
            login("Usuário", email, 'Free');
            router.push('/chat');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Bem-vindo de volta</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Entre na sua conta GospIA</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-zinc-500 transition-colors"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-zinc-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Não tem uma conta?{' '}
                    <Link href="/" className="text-zinc-900 dark:text-white font-medium hover:underline">
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </div>
    );
}
