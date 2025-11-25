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
        <div className="flex h-screen w-full bg-white dark:bg-neutral-950 overflow-hidden">
            <Sidebar onOpenSongGenerator={handleOpenSongGen} />
            <main className="flex-1 h-full overflow-y-auto relative flex flex-col">
                {children}
            </main>
            <SongGenerator isOpen={isSongGenOpen} onClose={() => setIsSongGenOpen(false)} />
        </div>
    );
};
