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
            alert("Upgrade para o GospIA Pro para acessar esta funcionalidade!");
            return;
        }
        setIsSongGenOpen(true);
    };

    return (
        <div className="flex h-screen w-full bg-misty-jade text-grafite-profundo font-display">
            <Sidebar onOpenSongGenerator={handleOpenSongGen} />
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {children}
            </main>
            <SongGenerator isOpen={isSongGenOpen} onClose={() => setIsSongGenOpen(false)} />
        </div>
    );
};
