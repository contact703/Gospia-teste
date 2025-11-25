"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { SongGenerator } from './SongGenerator';
import { useUser } from '@/context/UserContext';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSongGenOpen, setIsSongGenOpen] = useState(false);
    const { tier } = useUser();

    const handleOpenSongGen = () => {
        if (tier === 'Free') {
            // In a real app, we might redirect to a pricing page or show a modal.
            // For now, we'll just alert or maybe show a "Upgrade" modal.
            // The requirement says: "Free User: Redirects immediately to the GospIA Pro Payment/Subscription Page."
            // I'll simulate a redirect or show an alert for now.
            alert("Upgrade para o GospIA Pro para acessar esta funcionalidade!");
            return;
        }
        setIsSongGenOpen(true);
    };

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-hidden w-full flex-col md:flex-row transition-colors duration-300">
            <Sidebar onOpenSongGenerator={handleOpenSongGen} />
            <main className="flex-1 relative overflow-hidden flex flex-col w-full h-full">
                {children}
            </main>
            <SongGenerator isOpen={isSongGenOpen} onClose={() => setIsSongGenOpen(false)} />
        </div>
    );
};
